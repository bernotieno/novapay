use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: String,
    pub email: String,
    pub password_hash: String,
    pub full_name: String,
    pub phone_number: Option<String>,
    pub stellar_public_key: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUser {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 6))]
    pub password: String,
    #[validate(length(min = 2))]
    pub full_name: String,
    pub phone_number: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginUser {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub full_name: String,
    pub phone_number: Option<String>,
    pub stellar_public_key: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateUserProfile {
    #[validate(length(min = 2))]
    pub full_name: Option<String>,
    pub phone_number: Option<String>,
}