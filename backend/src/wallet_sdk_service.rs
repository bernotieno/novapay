use crate::wallet_sdk::{NovaPayWallet, WalletConfig, WalletError, PaymentResult};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletCreateRequest {
    pub user_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletCreateResponse {
    pub public_key: String,
    pub secret_key: String,
    pub wallet_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendPaymentRequest {
    pub destination: String,
    pub amount: String,
    pub asset_code: Option<String>,
    pub memo: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletBalanceResponse {
    pub balances: Vec<crate::wallet_sdk::Balance>,
    pub public_key: String,
}

pub struct WalletSDKService {
    config: WalletConfig,
}

impl WalletSDKService {
    pub fn new() -> Self {
        let network = env::var("STELLAR_NETWORK").unwrap_or_else(|_| "testnet".to_string());
        let horizon_url = if network == "testnet" {
            "https://horizon-testnet.stellar.org"
        } else {
            "https://horizon.stellar.org"
        };

        Self {
            config: WalletConfig {
                network,
                horizon_url: horizon_url.to_string(),
            },
        }
    }

    pub fn create_wallet(&self) -> WalletCreateResponse {
        let (public_key, secret_key) = NovaPayWallet::generate();
        let wallet_id = uuid::Uuid::new_v4().to_string();

        WalletCreateResponse {
            public_key,
            secret_key,
            wallet_id,
        }
    }

    pub async fn get_wallet_balance(&self, secret_key: &str) -> Result<WalletBalanceResponse, WalletError> {
        let wallet = NovaPayWallet::new(secret_key, self.config.clone())?;
        let balances = wallet.get_balances().await?;
        
        Ok(WalletBalanceResponse {
            balances,
            public_key: wallet.public_key(),
        })
    }

    pub async fn send_payment(
        &self,
        secret_key: &str,
        request: SendPaymentRequest,
    ) -> Result<PaymentResult, WalletError> {
        let wallet = NovaPayWallet::new(secret_key, self.config.clone())?;
        
        wallet.send_payment(
            &request.destination,
            &request.amount,
            request.asset_code.as_deref(),
        ).await
    }

    pub async fn fund_testnet_account(&self, secret_key: &str) -> Result<bool, WalletError> {
        let wallet = NovaPayWallet::new(secret_key, self.config.clone())?;
        wallet.fund_testnet().await
    }

    pub async fn create_trustline(
        &self,
        secret_key: &str,
        asset_code: &str,
        issuer: &str,
        limit: Option<&str>,
    ) -> Result<String, WalletError> {
        let wallet = NovaPayWallet::new(secret_key, self.config.clone())?;
        wallet.create_trustline(asset_code, issuer, limit).await
    }

    pub fn validate_stellar_address(&self, address: &str) -> bool {
        address.len() == 56 && address.starts_with('G')
    }

    pub fn validate_stellar_secret(&self, secret: &str) -> bool {
        secret.len() == 56 && secret.starts_with('S')
    }
}