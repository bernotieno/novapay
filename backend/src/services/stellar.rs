use serde::{Deserialize, Serialize};
use std::env;
use reqwest::Client;
use serde_json::json;

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
    contract_id: String,
}

impl StellarService {
    pub fn new() -> Self {
        Self {
            friendbot_client: Client::new(),
            contract_id: env::var("SOROBAN_CONTRACT_ID")
                .unwrap_or_else(|_| "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK".to_string()),
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

    pub async fn get_account_balance(&self, public_key: &str) -> Result<Vec<AccountBalance>, Box<dyn std::error::Error>> {
        // In production, query actual Stellar account via Horizon API
        let horizon_url = "https://horizon-testnet.stellar.org";
        let url = format!("{}/accounts/{}", horizon_url, public_key);
        
        match self.friendbot_client.get(&url).send().await {
            Ok(response) if response.status().is_success() => {
                let account_data: serde_json::Value = response.json().await?;
                let balances = account_data["balances"].as_array()
                    .unwrap_or(&vec![])
                    .iter()
                    .map(|b| AccountBalance {
                        balance: b["balance"].as_str().unwrap_or("0").to_string(),
                        asset_type: b["asset_type"].as_str().unwrap_or("native").to_string(),
                        asset_code: b["asset_code"].as_str().map(|s| s.to_string()),
                    })
                    .collect();
                Ok(balances)
            },
            _ => {
                // Return mock balance if account doesn't exist or API fails
                Ok(vec![AccountBalance {
                    balance: "10000.0000000".to_string(),
                    asset_type: "native".to_string(),
                    asset_code: None,
                }])
            }
        }
    }

    pub async fn send_payment(
        &self,
        from_secret: &str,
        to_public: &str,
        amount: f64,
        currency: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        // Call smart contract send_remittance function
        let amount_stroops = (amount * 10_000_000.0) as i128; // Convert to stroops
        
        let contract_call = json!({
            "method": "send_remittance",
            "parameters": [
                {"type": "Address", "value": from_secret},
                {"type": "String", "value": to_public},
                {"type": "i128", "value": amount_stroops.to_string()},
                {"type": "String", "value": currency}
            ]
        });
        
        println!("📞 Calling smart contract: {}", self.contract_id);
        println!("💰 Sending {} {} from {} to {}", amount, currency, from_secret, to_public);
        
        // For now, return mock hash until full Soroban integration
        let tx_hash = format!("soroban_tx_{}", uuid::Uuid::new_v4().to_string().replace("-", "")[..16].to_string());
        Ok(tx_hash)
    }
}