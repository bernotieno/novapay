use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Wallet {
    pub id: String,
    pub user_id: String,
    pub stellar_public_key: String,
    pub stellar_secret_key: String,
    pub balance: f64,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize)]
pub struct WalletResponse {
    pub id: String,
    pub stellar_public_key: String,
    pub balance: f64,
}