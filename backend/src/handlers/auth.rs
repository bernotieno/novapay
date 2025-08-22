use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use serde_json::{json, Value};
use sqlx::SqlitePool;
use uuid::Uuid;
use validator::Validate;

use crate::models::{CreateUser, LoginUser, User, UserResponse};
use crate::services::{AuthService, StellarService};

pub async fn register(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateUser>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let password_hash = AuthService::hash_password(&payload.password)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_id = Uuid::new_v4().to_string();
    let stellar_account = StellarService::generate_keypair();

    let result = sqlx::query(
        r#"
        INSERT INTO users (id, email, password_hash, full_name, stellar_public_key)
        VALUES (?, ?, ?, ?, ?)
        "#,
    )
    .bind(&user_id)
    .bind(&payload.email)
    .bind(&password_hash)
    .bind(&payload.full_name)
    .bind(&stellar_account.public_key)
    .execute(&pool)
    .await;

    match result {
        Ok(_) => {
            // Create wallet entry
            let wallet_id = Uuid::new_v4().to_string();
            let _ = sqlx::query(
                r#"
                INSERT INTO wallets (id, user_id, stellar_public_key, stellar_secret_key)
                VALUES (?, ?, ?, ?)
                "#,
            )
            .bind(&wallet_id)
            .bind(&user_id)
            .bind(&stellar_account.public_key)
            .bind(&stellar_account.secret_key)
            .execute(&pool)
            .await;

            let token = AuthService::generate_jwt(&user_id)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok(Json(json!({
                "token": token,
                "user": {
                    "id": user_id,
                    "email": payload.email,
                    "full_name": payload.full_name,
                    "stellar_public_key": stellar_account.public_key
                }
            })))
        }
        Err(_) => Err(StatusCode::CONFLICT),
    }
}

pub async fn login(
    State(pool): State<SqlitePool>,
    Json(payload): Json<LoginUser>,
) -> Result<Json<Value>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = ?")
        .bind(&payload.email)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => {
            let is_valid = AuthService::verify_password(&payload.password, &user.password_hash)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            if is_valid {
                let token = AuthService::generate_jwt(&user.id)
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                Ok(Json(json!({
                    "token": token,
                    "user": UserResponse {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        phone_number: user.phone_number,
                        stellar_public_key: user.stellar_public_key,
                    }
                })))
            } else {
                Err(StatusCode::UNAUTHORIZED)
            }
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}

pub async fn me(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
) -> Result<Json<UserResponse>, StatusCode> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(&user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => Ok(Json(UserResponse {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            phone_number: user.phone_number,
            stellar_public_key: user.stellar_public_key,
        })),
        None => Err(StatusCode::NOT_FOUND),
    }
}