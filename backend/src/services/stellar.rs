use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct StellarAccount {
    pub public_key: String,
    pub secret_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountBalance {
    pub balance: String,
    pub asset_type: String,
    pub asset_code: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StellarAccountResponse {
    pub id: String,
    pub balances: Vec<AccountBalance>,
}

pub struct StellarService {
    client: Client,
    horizon_url: String,
    friendbot_url: String,
}

impl StellarService {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            horizon_url: env::var("STELLAR_HORIZON_URL")
                .unwrap_or_else(|_| "https://horizon-testnet.stellar.org".to_string()),
            friendbot_url: env::var("FRIENDBOT_URL")
                .unwrap_or_else(|_| "https://friendbot.stellar.org".to_string()),
        }
    }

    pub fn generate_keypair() -> StellarAccount {
        // In a real implementation, use stellar-sdk to generate keypair
        // For now, return mock data
        StellarAccount {
            public_key: format!("G{}", uuid::Uuid::new_v4().to_string().replace("-", "").to_uppercase()),
            secret_key: format!("S{}", uuid::Uuid::new_v4().to_string().replace("-", "").to_uppercase()),
        }
    }

    pub async fn fund_test_account(&self, public_key: &str) -> Result<bool, reqwest::Error> {
        let url = format!("{}?addr={}", self.friendbot_url, public_key);
        let response = self.client.get(&url).send().await?;
        Ok(response.status().is_success())
    }

    pub async fn get_account_balance(&self, public_key: &str) -> Result<Vec<AccountBalance>, reqwest::Error> {
        let url = format!("{}/accounts/{}", self.horizon_url, public_key);
        let response = self.client.get(&url).send().await?;
        
        if response.status().is_success() {
            let account: StellarAccountResponse = response.json().await?;
            Ok(account.balances)
        } else {
            Ok(vec![])
        }
    }

    pub async fn send_payment(
        &self,
        _from_secret: &str,
        _to_public: &str,
        _amount: f64,
        _asset_code: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        // Mock transaction hash for demo
        Ok(format!("tx_{}", uuid::Uuid::new_v4()))
    }
}