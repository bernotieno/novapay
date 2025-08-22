use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;
use rand::rngs::OsRng;

#[derive(Error, Debug)]
pub enum WalletError {
    #[error("Invalid keypair: {0}")]
    InvalidKeypair(String),
    #[error("Network error: {0}")]
    NetworkError(String),
    #[error("Insufficient balance")]
    InsufficientBalance,
    #[error("Transaction failed: {0}")]
    TransactionFailed(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletConfig {
    pub network: String,
    pub horizon_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Balance {
    pub asset_code: String,
    pub balance: String,
    pub limit: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentResult {
    pub transaction_hash: String,
    pub amount: String,
    pub asset_code: String,
    pub destination: String,
}

pub struct NovaPayWallet {
    public_key: String,
    secret_key: String,
    config: WalletConfig,
}

impl NovaPayWallet {
    pub fn new(secret_key: &str, config: WalletConfig) -> Result<Self, WalletError> {
        // Basic validation
        if secret_key.len() != 56 || !secret_key.starts_with('S') {
            return Err(WalletError::InvalidKeypair("Invalid secret key format".to_string()));
        }
        
        // Generate corresponding public key (simplified)
        let public_key = format!("G{}", &secret_key[1..]);
        
        Ok(Self {
            public_key,
            secret_key: secret_key.to_string(),
            config,
        })
    }

    pub fn generate() -> (String, String) {
        let mut rng = OsRng;
        let random_bytes: [u8; 32] = rand::random();
        
        // Simplified Stellar key format
        let hex_str = hex::encode(&random_bytes);
        let public_key = format!("G{}", &hex_str[..55]);
        let secret_key = format!("S{}", &hex_str[..55]);
        
        (public_key, secret_key)
    }

    pub fn public_key(&self) -> String {
        self.public_key.clone()
    }

    pub async fn get_balances(&self) -> Result<Vec<Balance>, WalletError> {
        let client = reqwest::Client::new();
        let url = format!("{}/accounts/{}", self.config.horizon_url, self.public_key);
        
        let response = client.get(&url)
            .send()
            .await
            .map_err(|e| WalletError::NetworkError(e.to_string()))?;

        if !response.status().is_success() {
            return Ok(vec![Balance {
                asset_code: "XLM".to_string(),
                balance: "0.0000000".to_string(),
                limit: None,
            }]);
        }

        // Simplified balance parsing
        Ok(vec![Balance {
            asset_code: "XLM".to_string(),
            balance: "10000.0000000".to_string(),
            limit: None,
        }])
    }

    pub async fn send_payment(
        &self,
        destination: &str,
        amount: &str,
        _asset_code: Option<&str>,
    ) -> Result<PaymentResult, WalletError> {
        // Simulate payment
        let tx_hash = format!("tx_{}", uuid::Uuid::new_v4().to_string().replace("-", "")[..16].to_string());
        
        Ok(PaymentResult {
            transaction_hash: tx_hash,
            amount: amount.to_string(),
            asset_code: "XLM".to_string(),
            destination: destination.to_string(),
        })
    }

    pub async fn fund_testnet(&self) -> Result<bool, WalletError> {
        let client = reqwest::Client::new();
        let url = format!("https://friendbot.stellar.org?addr={}", self.public_key);
        
        let response = client.get(&url)
            .send()
            .await
            .map_err(|e| WalletError::NetworkError(e.to_string()))?;

        Ok(response.status().is_success())
    }

    pub async fn create_trustline(
        &self,
        asset_code: &str,
        issuer: &str,
        _limit: Option<&str>,
    ) -> Result<String, WalletError> {
        // Simulate trustline creation
        let tx_hash = format!("trustline_{}_{}", asset_code, &issuer[..8]);
        Ok(tx_hash)
    }
}

pub struct WalletManager {
    wallets: HashMap<String, NovaPayWallet>,
    config: WalletConfig,
}

impl WalletManager {
    pub fn new(config: WalletConfig) -> Self {
        Self {
            wallets: HashMap::new(),
            config,
        }
    }

    pub fn add_wallet(&mut self, id: &str, secret_key: &str) -> Result<(), WalletError> {
        let wallet = NovaPayWallet::new(secret_key, self.config.clone())?;
        self.wallets.insert(id.to_string(), wallet);
        Ok(())
    }

    pub fn get_wallet(&self, id: &str) -> Option<&NovaPayWallet> {
        self.wallets.get(id)
    }

    pub async fn bulk_payment(
        &self,
        wallet_id: &str,
        payments: Vec<(String, String)>,
    ) -> Result<Vec<PaymentResult>, WalletError> {
        let wallet = self.wallets.get(wallet_id)
            .ok_or_else(|| WalletError::TransactionFailed("Wallet not found".to_string()))?;

        let mut results = Vec::new();
        for (destination, amount) in payments {
            let result = wallet.send_payment(&destination, &amount, None).await?;
            results.push(result);
        }
        Ok(results)
    }
}