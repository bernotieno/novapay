mod handlers;
mod middleware;
mod models;
mod services;
mod wallet_sdk;
mod wallet_sdk_service;

use axum::{
    middleware::from_fn,
    routing::{get, post},
    Router,
};
use dotenvy::dotenv;
use sqlx::sqlite::SqlitePool;
use std::env;
use tower_http::cors::CorsLayer;
use tracing_subscriber::fmt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    fmt::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = SqlitePool::connect(&database_url).await?;

    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;
    
    // Initialize wallet balances for existing wallets
    sqlx::query("UPDATE wallets SET balance = 1000.0 WHERE balance = 0.0 OR balance IS NULL")
        .execute(&pool)
        .await?;

    // Protected routes
    let protected_routes = Router::new()
        .route("/auth/me", get(handlers::me))
        .route("/user/profile", get(handlers::get_profile))
        .route("/user/profile", post(handlers::update_profile).put(handlers::update_profile))
        .route("/transactions/send", post(handlers::send_money))
        .route("/transactions/history", get(handlers::get_transaction_history))
        .route("/stellar/fund-test-account", post(handlers::fund_test_account))
        .route("/stellar/get-balance", get(handlers::get_balance))
        .route("/wallet/balance", get(handlers::get_wallet_balance))
        .route("/wallet/deposit", post(handlers::deposit_from_mpesa))
        .route("/wallet/withdraw", post(handlers::withdraw_to_mpesa))
        .route("/wallet/transfer", post(handlers::transfer_to_wallet))
        .route("/sdk/wallet/create", post(handlers::create_wallet_sdk))
        .route("/sdk/wallet/balance", post(handlers::get_wallet_balance_sdk))
        .route("/sdk/wallet/send", post(handlers::send_payment_sdk))
        .route("/sdk/wallet/fund-testnet", post(handlers::fund_testnet_sdk))
        .route("/sdk/wallet/trustline", post(handlers::create_trustline_sdk))
        .layer(from_fn(middleware::auth_middleware));

    let app = Router::new()
        // Public routes
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        // Merge protected routes
        .merge(protected_routes)
        .layer(CorsLayer::permissive())
        .with_state(pool);

    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    println!("🚀 NovaPay Backend running on port {} with wallet balances initialized", port);
    axum::serve(listener, app).await?;

    Ok(())
}