use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::SqlitePool;
use validator::Validate;

use crate::services::WalletService;

#[derive(Debug, Deserialize, Validate)]
pub struct DepositRequest {
    #[validate(range(min = 1.0))]
    pub kes_amount: f64,
    pub mpesa_ref: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct WithdrawRequest {
    #[validate(range(min = 0.01))]
    pub xlm_amount: f64,
    pub mpesa_number: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct TransferRequest {
    #[validate(range(min = 0.01))]
    pub xlm_amount: f64,
    pub to_wallet_id: String,
}

#[derive(Debug, Serialize)]
pub struct WalletBalance {
    pub xlm_balance: f64,
    pub kes_equivalent: f64,
    pub wallet_id: String,
}

pub async fn get_wallet_balance(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
) -> Result<Json<WalletBalance>, StatusCode> {
    let wallet_service = WalletService::new();
    
    let xlm_balance = wallet_service
        .get_wallet_balance(&pool, &user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let kes_equivalent = wallet_service.convert_xlm_to_kes(xlm_balance);

    // Get wallet ID (public key)
    let wallet = sqlx::query_as::<_, crate::models::Wallet>("SELECT * FROM wallets WHERE user_id = ?")
        .bind(&user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let wallet_id = wallet.map(|w| w.stellar_public_key).unwrap_or_default();

    Ok(Json(WalletBalance {
        xlm_balance,
        kes_equivalent,
        wallet_id,
    }))
}

pub async fn deposit_from_mpesa(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<DepositRequest>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let wallet_service = WalletService::new();
    
    let tx_hash = wallet_service
        .deposit_from_mpesa(&pool, &user_id, payload.kes_amount, &payload.mpesa_ref)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let xlm_amount = wallet_service.convert_kes_to_xlm(payload.kes_amount);

    Ok(Json(json!({
        "success": true,
        "message": "Deposit successful",
        "kes_amount": payload.kes_amount,
        "xlm_amount": xlm_amount,
        "tx_hash": tx_hash
    })))
}

pub async fn withdraw_to_mpesa(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<WithdrawRequest>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let wallet_service = WalletService::new();
    
    let tx_hash = wallet_service
        .withdraw_to_mpesa(&pool, &user_id, payload.xlm_amount, &payload.mpesa_number)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let kes_amount = wallet_service.convert_xlm_to_kes(payload.xlm_amount);

    Ok(Json(json!({
        "success": true,
        "message": "Withdrawal successful",
        "xlm_amount": payload.xlm_amount,
        "kes_amount": kes_amount,
        "tx_hash": tx_hash
    })))
}

pub async fn transfer_to_wallet(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<TransferRequest>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let wallet_service = WalletService::new();
    
    let tx_hash = wallet_service
        .transfer_to_wallet(&pool, &user_id, &payload.to_wallet_id, payload.xlm_amount)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(json!({
        "success": true,
        "message": "Transfer successful",
        "xlm_amount": payload.xlm_amount,
        "to_wallet_id": payload.to_wallet_id,
        "tx_hash": tx_hash
    })))
}