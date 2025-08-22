use axum::{
    extract::{Extension, State},
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use validator::Validate;

use crate::models::{User, UserResponse, UpdateUserProfile};

pub async fn get_profile(
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

pub async fn update_profile(
    State(pool): State<SqlitePool>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<UpdateUserProfile>,
) -> Result<Json<UserResponse>, StatusCode> {
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Update user profile
    let result = sqlx::query(
        r#"
        UPDATE users 
        SET full_name = COALESCE(?, full_name),
            phone_number = COALESCE(?, phone_number),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        "#,
    )
    .bind(&payload.full_name)
    .bind(&payload.phone_number)
    .bind(&user_id)
    .execute(&pool)
    .await;

    match result {
        Ok(_) => {
            // Fetch updated user
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
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}