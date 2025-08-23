use axum::{extract::State, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::models::Wallet;

#[derive(Debug, Deserialize)]
pub struct FonbnkDepositRequest {
    pub phone_number: String,
    pub airtime_amount: f64,
    pub currency: String,
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
    println!("📱 Fonbnk API: {} {} → Converting...", request.airtime_amount, request.currency);
    
    // Mock conversion rates
    let usd_rate = match request.currency.as_str() {
        "KES" => 0.0067,
        "UGX" => 0.00027,
        "TZS" => 0.00040,
        _ => 0.0067,
    };
    
    let usd_amount = request.airtime_amount * usd_rate;
    let xlm_amount = usd_amount * 8.33; // USD to XLM
    
    // Use existing user for testing
    let user_id = "b0003fde-6403-4412-979d-8320c5e63f5b"; // messi@gmail.com
    
    // Update wallet balance
    match add_xlm_to_wallet(&pool, user_id, xlm_amount).await {
        Ok(new_balance) => {
            let tx_id = format!("fonbnk_{}", Uuid::new_v4().to_string().replace("-", "")[..12].to_string());
            
            println!("✅ Fonbnk Success: {} {} → ${:.2} → {:.4} XLM", 
                request.airtime_amount, request.currency, usd_amount, xlm_amount);
            
            Ok(Json(FonbnkDepositResponse {
                success: true,
                transaction_id: tx_id,
                usd_amount,
                xlm_amount,
                new_balance,
                message: format!("Successfully converted {} {} to {:.4} XLM", 
                    request.airtime_amount, request.currency, xlm_amount),
            }))
        }
        Err(e) => {
            println!("❌ Wallet update failed: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn add_xlm_to_wallet(
    pool: &SqlitePool,
    user_id: &str,
    xlm_amount: f64,
) -> Result<f64, Box<dyn std::error::Error>> {
    // Get user's wallet or create demo wallet
    let wallet = match sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
        .bind(user_id)
        .fetch_optional(pool)
        .await? {
        Some(wallet) => wallet,
        None => {
            // Create demo wallet
            let wallet_id = Uuid::new_v4().to_string();
            let demo_public_key = format!("GDEMO{}", &wallet_id.replace("-", "")[..20]);
            let demo_secret_key = format!("SDEMO{}", &wallet_id.replace("-", "")[..20]);
            
            sqlx::query(
                "INSERT INTO wallets (id, user_id, stellar_public_key, stellar_secret_key, balance) VALUES (?, ?, ?, ?, ?)"
            )
            .bind(&wallet_id)
            .bind(user_id)
            .bind(&demo_public_key)
            .bind(&demo_secret_key)
            .bind(1000.0) // Starting balance
            .execute(pool)
            .await?;
            
            sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
                .bind(user_id)
                .fetch_one(pool)
                .await?
        }
    };

    // Update wallet balance
    let new_balance = wallet.balance + xlm_amount;
    sqlx::query("UPDATE wallets SET balance = ? WHERE user_id = ?")
        .bind(new_balance)
        .bind(user_id)
        .execute(pool)
        .await?;

    // Record transaction
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
    .bind(&format!("fonbnk_tx_{}", deposit_id))
    .bind("completed")
    .execute(pool)
    .await?;

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
    let from_currency = request["from_currency"].as_str().unwrap_or("KES");
    let to_currency = request["to_currency"].as_str().unwrap_or("USD");

    let rate = match (from_currency, to_currency) {
        ("KES", "USD") => 0.0067,
        ("UGX", "USD") => 0.00027,
        ("TZS", "USD") => 0.00040,
        _ => 0.0067,
    };

    Ok(Json(FonbnkRateResponse {
        from_currency: from_currency.to_string(),
        to_currency: to_currency.to_string(),
        rate,
    }))
}