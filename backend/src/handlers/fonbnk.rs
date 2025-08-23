use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::models::Wallet;
use crate::services::FonbnkService;

#[derive(Debug, Deserialize)]
pub struct FonbnkDepositRequest {
    pub phone_number: String,
    pub airtime_amount: f64,
    pub currency: String, // KES, UGX, TZS
}

#[derive(Debug, Serialize)]
pub struct FonbnkDepositResponse {
    pub success: bool,
    pub transaction_id: String,
    pub usd_amount: f64,
    pub xlm_amount: f64,
    pub new_balance: f64,
    pub message: String,
}

pub async fn deposit_via_fonbnk(
    State(pool): State<SqlitePool>,
    Json(request): Json<FonbnkDepositRequest>,
) -> Result<Json<FonbnkDepositResponse>, StatusCode> {
    let fonbnk_service = FonbnkService::new();
    // TODO: Get user_id from JWT token in production
    let user_id = "demo_user_1"; // Temporary for testing

    // Convert airtime to USD via Fonbnk
    match fonbnk_service
        .convert_airtime(&request.phone_number, request.airtime_amount, &request.currency)
        .await
    {
        Ok(fonbnk_response) => {
            if fonbnk_response.success {
                // Convert USD to XLM (using rate: 1 USD = 8.33 XLM approximately)
                let xlm_amount = fonbnk_response.usd_amount * 8.33;

                // Add XLM to user's wallet
                match add_xlm_to_wallet(&pool, user_id, xlm_amount, &fonbnk_response.transaction_id).await {
                    Ok(new_balance) => {
                        Ok(Json(FonbnkDepositResponse {
                            success: true,
                            transaction_id: fonbnk_response.transaction_id,
                            usd_amount: fonbnk_response.usd_amount,
                            xlm_amount,
                            new_balance,
                            message: "Airtime successfully converted and deposited".to_string(),
                        }))
                    }
                    Err(e) => {
                        println!("Failed to add XLM to wallet: {}", e);
                        Err(StatusCode::INTERNAL_SERVER_ERROR)
                    }
                }
            } else {
                println!("Fonbnk conversion failed: {:?}", fonbnk_response.message);
                Err(StatusCode::BAD_REQUEST)
            }
        }
        Err(e) => {
            println!("Fonbnk API error: {}", e);
            Err(StatusCode::SERVICE_UNAVAILABLE)
        }
    }
}

async fn add_xlm_to_wallet(
    pool: &SqlitePool,
    user_id: &str,
    xlm_amount: f64,
    fonbnk_tx_id: &str,
) -> Result<f64, Box<dyn std::error::Error>> {
    // Get user's wallet
    let wallet = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
        .bind(user_id)
        .fetch_one(pool)
        .await?;

    // Update wallet balance
    let new_balance = wallet.balance + xlm_amount;
    sqlx::query("UPDATE wallets SET balance = ? WHERE user_id = ?")
        .bind(new_balance)
        .bind(user_id)
        .execute(pool)
        .await?;

    // Record the deposit transaction
    let deposit_id = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO transactions (id, user_id, recipient_email, amount, currency, target_currency, stellar_tx_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(&deposit_id)
    .bind(user_id)
    .bind("fonbnk_deposit")
    .bind(xlm_amount)
    .bind("USD")
    .bind("XLM")
    .bind(fonbnk_tx_id)
    .bind("completed")
    .execute(pool)
    .await?;

    println!("💰 Fonbnk Deposit: {} XLM added to wallet (Fonbnk TX: {})", xlm_amount, fonbnk_tx_id);
    Ok(new_balance)
}

#[derive(Debug, Serialize)]
pub struct FonbnkRateResponse {
    pub from_currency: String,
    pub to_currency: String,
    pub rate: f64,
}

pub async fn get_fonbnk_rate(
    Json(request): Json<serde_json::Value>,
) -> Result<Json<FonbnkRateResponse>, StatusCode> {
    let fonbnk_service = FonbnkService::new();
    
    let from_currency = request["from_currency"].as_str().unwrap_or("KES");
    let to_currency = request["to_currency"].as_str().unwrap_or("USD");

    match fonbnk_service.get_conversion_rate(from_currency, to_currency).await {
        Ok(rate) => Ok(Json(FonbnkRateResponse {
            from_currency: from_currency.to_string(),
            to_currency: to_currency.to_string(),
            rate,
        })),
        Err(e) => {
            println!("Failed to get Fonbnk rate: {}", e);
            Err(StatusCode::SERVICE_UNAVAILABLE)
        }
    }
}