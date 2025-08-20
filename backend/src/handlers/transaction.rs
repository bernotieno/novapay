use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use serde_json::{json, Value};
use sqlx::SqlitePool;
use validator::Validate;

use crate::models::{CreateTransaction, TransactionResponse};
use crate::services::TransactionService;

pub async fn send_money(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<CreateTransaction>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let tx_service = TransactionService::new();
    
    let transaction = tx_service
        .create_transaction(&pool, &user_id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Get user's wallet for payment processing
    let wallet = sqlx::query_as::<_, crate::models::Wallet>("SELECT * FROM wallets WHERE user_id = ?")
        .bind(&user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Some(wallet) = wallet {
        // Mock recipient public key (in real app, look up by email)
        let recipient_public_key = "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        
        let tx_hash = tx_service
            .process_payment(&pool, &transaction.id, &wallet.stellar_secret_key, recipient_public_key)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Ok(Json(json!({
            "transaction": TransactionResponse {
                id: transaction.id,
                recipient_email: transaction.recipient_email,
                amount: transaction.amount,
                currency: transaction.currency,
                target_currency: transaction.target_currency,
                status: "completed".to_string(),
                created_at: transaction.created_at,
                stellar_tx_hash: Some(tx_hash),
            }
        })))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn get_transaction_history(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
) -> Result<Json<Vec<TransactionResponse>>, StatusCode> {
    let tx_service = TransactionService::new();
    
    let transactions = tx_service
        .get_user_transactions(&pool, &user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response: Vec<TransactionResponse> = transactions
        .into_iter()
        .map(|tx| TransactionResponse {
            id: tx.id,
            recipient_email: tx.recipient_email,
            amount: tx.amount,
            currency: tx.currency,
            target_currency: tx.target_currency,
            status: tx.status,
            created_at: tx.created_at,
            stellar_tx_hash: tx.stellar_tx_hash,
        })
        .collect();

    Ok(Json(response))
}