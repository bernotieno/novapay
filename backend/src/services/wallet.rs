use crate::models::Wallet;
use crate::services::{StellarService, stellar_sdk::StellarSDK};
use sqlx::SqlitePool;
use uuid::Uuid;
use std::collections::HashMap;

pub struct WalletService {
    stellar_service: StellarService,
    stellar_sdk: StellarSDK,
    // In-memory balance tracking for demo
    balances: HashMap<String, f64>,
}

impl WalletService {
    pub fn new() -> Self {
        let mut balances = HashMap::new();
        // Initialize with some demo balances
        balances.insert("demo_wallet_1".to_string(), 1000.0);
        balances.insert("demo_wallet_2".to_string(), 500.0);
        
        Self {
            stellar_service: StellarService::new(),
            stellar_sdk: StellarSDK::new(),
            balances,
        }
    }

    pub async fn get_wallet_balance(&self, pool: &SqlitePool, user_id: &str) -> Result<f64, Box<dyn std::error::Error>> {
        let wallet = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
            .bind(user_id)
            .fetch_optional(pool)
            .await?;

        if let Some(wallet) = wallet {
            // Return balance from database (which tracks our simulated transactions)
            Ok(wallet.balance)
        } else {
            Ok(0.0)
        }
    }

    pub async fn deposit_from_mpesa(&self, pool: &SqlitePool, user_id: &str, kes_amount: f64, mpesa_ref: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Convert KES to XLM (mock rate: 1 XLM = 120 KES)
        let xlm_amount = kes_amount / 120.0;
        
        let wallet = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
            .bind(user_id)
            .fetch_one(pool)
            .await?;

        // Fund wallet with XLM (using friendbot for testnet)
        self.stellar_service.fund_test_account(&wallet.stellar_public_key).await?;
        let tx_hash = format!("deposit_{}", uuid::Uuid::new_v4());
        
        // Record deposit transaction
        let deposit_id = Uuid::new_v4().to_string();
        sqlx::query(
            "INSERT INTO transactions (id, user_id, recipient_email, amount, currency, target_currency, stellar_tx_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&deposit_id)
        .bind(user_id)
        .bind("deposit")
        .bind(xlm_amount)
        .bind("XLM")
        .bind("XLM")
        .bind(&tx_hash)
        .bind("completed")
        .execute(pool)
        .await?;

        println!("💰 Deposit: {} KES → {} XLM (Ref: {})", kes_amount, xlm_amount, mpesa_ref);
        Ok(tx_hash)
    }

    pub async fn withdraw_to_mpesa(&self, pool: &SqlitePool, user_id: &str, xlm_amount: f64, mpesa_number: &str) -> Result<String, Box<dyn std::error::Error>> {
        let wallet = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
            .bind(user_id)
            .fetch_one(pool)
            .await?;

        // Send XLM from wallet (mock withdrawal)
        let tx_hash = self.stellar_service.send_payment(&wallet.stellar_secret_key, "WITHDRAWAL_ACCOUNT", xlm_amount, "XLM").await?;
        
        // Convert XLM to KES for M-Pesa
        let kes_amount = xlm_amount * 120.0;
        
        // Record withdrawal transaction
        let withdrawal_id = Uuid::new_v4().to_string();
        sqlx::query(
            "INSERT INTO transactions (id, user_id, recipient_email, amount, currency, target_currency, stellar_tx_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&withdrawal_id)
        .bind(user_id)
        .bind(mpesa_number)
        .bind(xlm_amount)
        .bind("XLM")
        .bind("KES")
        .bind(&tx_hash)
        .bind("completed")
        .execute(pool)
        .await?;

        println!("💸 Withdrawal: {} XLM → {} KES to {}", xlm_amount, kes_amount, mpesa_number);
        Ok(tx_hash)
    }

    pub async fn transfer_to_wallet(&self, pool: &SqlitePool, from_user_id: &str, to_wallet_id: &str, xlm_amount: f64) -> Result<String, Box<dyn std::error::Error>> {
        let from_wallet = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE user_id = ?")
            .bind(from_user_id)
            .fetch_one(pool)
            .await?;

        // Check if sender has sufficient balance
        let current_balance = self.get_wallet_balance(pool, from_user_id).await?;
        if current_balance < xlm_amount {
            return Err("Insufficient balance".into());
        }

        // Send XLM using Stellar SDK
        let tx_hash = self.stellar_sdk.send_xlm_payment(
            &from_wallet.stellar_secret_key, 
            to_wallet_id, 
            xlm_amount
        ).await?;
        
        // Update balances in database (simulate balance changes)
        self.update_balance_after_transfer(pool, from_user_id, to_wallet_id, xlm_amount).await?;
        
        // Record transfer transaction
        let transfer_id = Uuid::new_v4().to_string();
        sqlx::query(
            "INSERT INTO transactions (id, user_id, recipient_email, amount, currency, target_currency, stellar_tx_hash, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&transfer_id)
        .bind(from_user_id)
        .bind(to_wallet_id)
        .bind(xlm_amount)
        .bind("XLM")
        .bind("XLM")
        .bind(&tx_hash)
        .bind("completed")
        .execute(pool)
        .await?;

        println!("🔄 Transfer: {} XLM from {} to {} (Hash: {})", xlm_amount, from_user_id, to_wallet_id, tx_hash);
        Ok(tx_hash)
    }
    
    async fn update_balance_after_transfer(&self, pool: &SqlitePool, from_user_id: &str, to_wallet_id: &str, amount: f64) -> Result<(), Box<dyn std::error::Error>> {
        // Update sender's balance (decrease)
        let sender_balance = self.get_wallet_balance(pool, from_user_id).await?;
        let new_sender_balance = sender_balance - amount;
        
        sqlx::query("UPDATE wallets SET balance = ? WHERE user_id = ?")
            .bind(new_sender_balance)
            .bind(from_user_id)
            .execute(pool)
            .await?;
            
        // Find recipient by wallet ID and update their balance (increase)
        if let Some(recipient) = sqlx::query_as::<_, Wallet>("SELECT * FROM wallets WHERE stellar_public_key = ?")
            .bind(to_wallet_id)
            .fetch_optional(pool)
            .await? {
            
            let recipient_balance = recipient.balance;
            let new_recipient_balance = recipient_balance + amount;
            
            sqlx::query("UPDATE wallets SET balance = ? WHERE user_id = ?")
                .bind(new_recipient_balance)
                .bind(&recipient.user_id)
                .execute(pool)
                .await?;
                
            println!("💰 Transfer complete:");
            println!("   Sender {}: {} XLM → {} XLM", from_user_id, sender_balance, new_sender_balance);
            println!("   Recipient {}: {} XLM → {} XLM", recipient.user_id, recipient_balance, new_recipient_balance);
        }
        
        Ok(())
    }

    pub fn convert_xlm_to_kes(&self, xlm_amount: f64) -> f64 {
        xlm_amount * 120.0 // Mock rate: 1 XLM = 120 KES
    }

    pub fn convert_kes_to_xlm(&self, kes_amount: f64) -> f64 {
        kes_amount / 120.0
    }
}