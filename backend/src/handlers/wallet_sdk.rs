use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use serde_json::{json, Value};
use sqlx::SqlitePool;

use crate::wallet_sdk_service::{WalletSDKService, SendPaymentRequest};

pub async fn create_wallet(
    State(_pool): State<SqlitePool>,
    Extension(_user_id): Extension<String>,
) -> Result<Json<Value>, StatusCode> {
    let service = WalletSDKService::new();
    let response = service.create_wallet();
    
    Ok(Json(json!({
        "public_key": response.public_key,
        "secret_key": response.secret_key,
        "wallet_id": response.wallet_id
    })))
}

pub async fn get_wallet_balance_sdk(
    State(_pool): State<SqlitePool>,
    Extension(_user_id): Extension<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let secret_key = payload["secret_key"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;

    let service = WalletSDKService::new();
    
    match service.get_wallet_balance(secret_key).await {
        Ok(response) => Ok(Json(json!({
            "balances": response.balances,
            "public_key": response.public_key
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn send_payment_sdk(
    State(_pool): State<SqlitePool>,
    Extension(_user_id): Extension<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let secret_key = payload["secret_key"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;
    
    let destination = payload["destination"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;
    
    let amount = payload["amount"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;

    let asset_code = payload["asset_code"].as_str();

    let request = SendPaymentRequest {
        destination: destination.to_string(),
        amount: amount.to_string(),
        asset_code: asset_code.map(|s| s.to_string()),
        memo: payload["memo"].as_str().map(|s| s.to_string()),
    };

    let service = WalletSDKService::new();
    
    match service.send_payment(secret_key, request).await {
        Ok(result) => Ok(Json(json!({
            "transaction_hash": result.transaction_hash,
            "amount": result.amount,
            "asset_code": result.asset_code,
            "destination": result.destination
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn fund_testnet_sdk(
    State(_pool): State<SqlitePool>,
    Extension(_user_id): Extension<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let secret_key = payload["secret_key"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;

    let service = WalletSDKService::new();
    
    match service.fund_testnet_account(secret_key).await {
        Ok(success) => Ok(Json(json!({
            "success": success,
            "message": if success { "Account funded successfully" } else { "Failed to fund account" }
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn create_trustline_sdk(
    State(_pool): State<SqlitePool>,
    Extension(_user_id): Extension<String>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    let secret_key = payload["secret_key"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;
    
    let asset_code = payload["asset_code"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;
    
    let issuer = payload["issuer"]
        .as_str()
        .ok_or(StatusCode::BAD_REQUEST)?;

    let limit = payload["limit"].as_str();

    let service = WalletSDKService::new();
    
    match service.create_trustline(secret_key, asset_code, issuer, limit).await {
        Ok(tx_hash) => Ok(Json(json!({
            "transaction_hash": tx_hash,
            "asset_code": asset_code,
            "issuer": issuer
        }))),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}