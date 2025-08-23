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
use sqlx::{sqlite::SqlitePool, postgres::PgPool, Pool, Sqlite, Postgres};
use std::env;
use tower_http::cors::CorsLayer;
use tracing_subscriber::fmt;

#[derive(Clone)]
enum DatabasePool {
    Sqlite(Pool<Sqlite>),
    Postgres(Pool<Postgres>),
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    fmt::init();

    println!("🚀 Starting NovaPay Backend...");
    
    let database_url = match env::var("DATABASE_URL") {
        Ok(url) => {
            println!("✅ DATABASE_URL found");
            url
        }
        Err(_) => {
            eprintln!("❌ DATABASE_URL environment variable is required");
            std::process::exit(1);
        }
    };
    
    // Determine database type and create appropriate pool
    println!("🔌 Connecting to database...");
    let pool = if database_url.starts_with("postgres://") || database_url.starts_with("postgresql://") {
        println!("📊 Using PostgreSQL database");
        match PgPool::connect(&database_url).await {
            Ok(pg_pool) => {
                println!("✅ PostgreSQL connection successful");
                DatabasePool::Postgres(pg_pool)
            }
            Err(e) => {
                eprintln!("❌ Failed to connect to PostgreSQL: {}", e);
                std::process::exit(1);
            }
        }
    } else {
        println!("📊 Using SQLite database");
        match SqlitePool::connect(&database_url).await {
            Ok(sqlite_pool) => {
                println!("✅ SQLite connection successful");
                DatabasePool::Sqlite(sqlite_pool)
            }
            Err(e) => {
                eprintln!("❌ Failed to connect to SQLite: {}", e);
                std::process::exit(1);
            }
        }
    };

    // Run migrations based on database type
    println!("🔄 Running database migrations...");
    match &pool {
        DatabasePool::Sqlite(sqlite_pool) => {
            if let Err(e) = sqlx::migrate!("./migrations").run(sqlite_pool).await {
                eprintln!("❌ SQLite migration failed: {}", e);
                std::process::exit(1);
            }
            // Initialize wallet balances for existing wallets
            sqlx::query("UPDATE wallets SET balance = 1000.0 WHERE balance = 0.0 OR balance IS NULL")
                .execute(sqlite_pool)
                .await?;
        }
        DatabasePool::Postgres(pg_pool) => {
            if let Err(e) = sqlx::migrate!("./migrations").run(pg_pool).await {
                eprintln!("❌ PostgreSQL migration failed: {}", e);
                std::process::exit(1);
            }
            // Initialize wallet balances for existing wallets
            sqlx::query("UPDATE wallets SET balance = 1000.0 WHERE balance = 0.0 OR balance IS NULL")
                .execute(pg_pool)
                .await?;
        }
    }
    println!("✅ Database migrations completed");

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

    // Configure CORS for production
    let cors = CorsLayer::new()
        .allow_origin([
            "http://localhost:5173".parse().unwrap(),
            "https://novapay.onrender.com".parse().unwrap(),
            "https://your-frontend-domain.com".parse().unwrap(),
        ])
        .allow_methods([axum::http::Method::GET, axum::http::Method::POST, axum::http::Method::PUT, axum::http::Method::DELETE])
        .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION]);

    let app = Router::new()
        // Health check
        .route("/health", get(handlers::health_check))
        // Public routes
        .route("/auth/register", post(handlers::register))
        .route("/auth/login", post(handlers::login))
        // Fonbnk routes (public for testing)
        .route("/fonbnk/deposit", post(handlers::deposit_via_fonbnk))
        .route("/fonbnk/rate", post(handlers::get_fonbnk_rate))
        // Merge protected routes
        .merge(protected_routes)
        .layer(cors)
        .with_state(match pool {
    DatabasePool::Sqlite(sqlite_pool) => sqlite_pool,
    DatabasePool::Postgres(pg_pool) => pg_pool,
});

    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    println!("🌐 Binding to port: {}", port);
    
    let listener = match tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await {
        Ok(listener) => {
            println!("✅ Successfully bound to 0.0.0.0:{}", port);
            listener
        }
        Err(e) => {
            eprintln!("❌ Failed to bind to port {}: {}", port, e);
            std::process::exit(1);
        }
    };
    
    println!("🚀 NovaPay Backend running on port {} with wallet balances initialized", port);
    
    if let Err(e) = axum::serve(listener, app).await {
        eprintln!("❌ Server error: {}", e);
        std::process::exit(1);
    }

    Ok(())
}