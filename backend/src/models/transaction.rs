use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Transaction {
    pub id: String,
    pub user_id: String,
    pub recipient_email: String,
    pub amount: f64,
    pub currency: String,
    pub target_currency: String,
    pub stellar_tx_hash: Option<String>,
    pub status: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateTransaction {
    #[validate(email)]
    pub recipient_email: String,
    #[validate(range(min = 0.01))]
    pub amount: f64,
    pub currency: Option<String>,
    pub target_currency: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TransactionResponse {
    pub id: String,
    pub recipient_email: String,
    pub amount: f64,
    pub currency: String,
    pub target_currency: String,
    pub status: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub stellar_tx_hash: Option<String>,
}