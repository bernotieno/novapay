pub mod auth;
pub mod fonbnk;
pub mod fonbnk_simple;
pub mod stellar;
pub mod transaction;
pub mod user;
pub mod wallet;
pub mod wallet_sdk;

pub use auth::*;
pub use fonbnk_simple::{deposit_via_fonbnk, get_fonbnk_rate};
pub use stellar::*;
pub use transaction::*;
pub use user::*;
pub use wallet::*;
pub use wallet_sdk::{create_wallet as create_wallet_sdk, get_wallet_balance_sdk, send_payment_sdk, fund_testnet_sdk, create_trustline_sdk};

// Health check endpoint
use axum::response::Json;
use serde_json::{json, Value};

pub async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "healthy",
        "service": "novapay-backend",
        "version": "0.1.0",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}