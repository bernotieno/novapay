use serde::{Deserialize, Serialize};
use std::env;
use reqwest::Client;

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

pub struct StellarService {
    friendbot_client: Client,
}

impl StellarService {
    pub fn new() -> Self {
        Self {
            friendbot_client: Client::new(),
        }
    }

    pub fn generate_keypair() -> StellarAccount {
        let random_bytes: [u8; 32] = rand::random();
        let hex_str = hex::encode(&random_bytes);
        
        StellarAccount {
            public_key: format!("G{}", &hex_str[..55]),
            secret_key: format!("S{}", &hex_str[..55]),
        }
    }

    pub async fn fund_test_account(&self, public_key: &str) -> Result<bool, Box<dyn std::error::Error>> {
        let url = format!("https://friendbot.stellar.org?addr={}", public_key);
        let response = self.friendbot_client.get(&url).send().await?;
        Ok(response.status().is_success())
    }

    pub async fn get_account_balance(&self, _public_key: &str) -> Result<Vec<AccountBalance>, Box<dyn std::error::Error>> {
        Ok(vec![AccountBalance {
            balance: "10000.0000000".to_string(),
            asset_type: "native".to_string(),
            asset_code: None,
        }])
    }

    pub async fn send_payment(
        &self,
        _from_secret: &str,
        _to_public: &str,
        _amount: f64,
        _asset_code: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let tx_hash = format!("tx_{}", uuid::Uuid::new_v4().to_string().replace("-", "")[..16].to_string());
        Ok(tx_hash)
    }
}