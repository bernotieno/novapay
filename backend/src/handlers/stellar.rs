use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use serde_json::{json, Value};
use sqlx::SqlitePool;

use crate::services::StellarService;
use crate::models::User;

pub async fn fund_test_account(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
) -> Result<Json<Value>, StatusCode> {
    let stellar_service = StellarService::new();

    // Get user's stellar public key
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(&user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => {
            if let Some(public_key) = user.stellar_public_key {
                let success = stellar_service
                    .fund_test_account(&public_key)
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                if success {
                    Ok(Json(json!({
                        "success": true,
                        "message": "Test account funded successfully"
                    })))
                } else {
                    Err(StatusCode::BAD_REQUEST)
                }
            } else {
                Err(StatusCode::NOT_FOUND)
            }
        }
        None => Err(StatusCode::NOT_FOUND),
    }
}

pub async fn get_balance(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
) -> Result<Json<Value>, StatusCode> {
    let stellar_service = StellarService::new();

    // Get user's stellar public key
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(&user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => {
            if let Some(public_key) = user.stellar_public_key {
                let balances = stellar_service
                    .get_account_balance(&public_key)
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                Ok(Json(json!({
                    "public_key": public_key,
                    "balances": balances
                })))
            } else {
                Err(StatusCode::NOT_FOUND)
            }
        }
        None => Err(StatusCode::NOT_FOUND),
    }
}