use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize)]
pub struct FonbnkConvertRequest {
    pub phone_number: String,
    pub amount: f64,
    pub currency: String,
}

#[derive(Debug, Deserialize)]
pub struct FonbnkConvertResponse {
    pub success: bool,
    pub transaction_id: String,
    pub usd_amount: f64,
    pub exchange_rate: f64,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Debug)]
pub struct FonbnkService {
    client: Client,
    client_id: String,
    api_signature_secret: String,
    url_signature_secret: String,
    source_param: String,
    base_url: String,
}

impl FonbnkService {
    pub fn new() -> Self {
        let client_id = env::var("FONBNK_CLIENT_ID")
            .expect("FONBNK_CLIENT_ID must be set");
        let api_signature_secret = env::var("FONBNK_API_SIGNATURE_SECRET")
            .expect("FONBNK_API_SIGNATURE_SECRET must be set");
        let url_signature_secret = env::var("FONBNK_URL_SIGNATURE_SECRET")
            .expect("FONBNK_URL_SIGNATURE_SECRET must be set");
        let source_param = env::var("FONBNK_SOURCE_PARAM")
            .expect("FONBNK_SOURCE_PARAM must be set");
        let base_url = env::var("FONBNK_BASE_URL")
            .unwrap_or_else(|_| "https://api.fonbnk.com".to_string());
        
        println!("📱 Fonbnk API: {} (Client: {})", base_url, &client_id[..8]);
        
        Self {
            client: Client::new(),
            client_id,
            api_signature_secret,
            url_signature_secret,
            source_param,
            base_url,
        }
    }

    pub async fn convert_airtime(
        &self,
        phone_number: &str,
        amount: f64,
        currency: &str,
    ) -> Result<FonbnkConvertResponse, Box<dyn std::error::Error>> {
        // Real Fonbnk API call with proper authentication

        let request = FonbnkConvertRequest {
            phone_number: phone_number.to_string(),
            amount,
            currency: currency.to_string(),
        };

        let response = self
            .client
            .post(&format!("{}/airtime/purchase", self.base_url))
            .header("X-Client-ID", &self.client_id)
            .header("X-API-Signature", &self.api_signature_secret)
            .header("X-Source", &self.source_param)
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await?;

        if response.status().is_success() {
            let fonbnk_response: FonbnkConvertResponse = response.json().await?;
            Ok(fonbnk_response)
        } else {
            let error_text = response.text().await?;
            Err(format!("Fonbnk API error: {}", error_text).into())
        }
    }



    pub async fn get_conversion_rate(
        &self,
        from_currency: &str,
        to_currency: &str,
    ) -> Result<f64, Box<dyn std::error::Error>> {
        // Real Fonbnk rates API call

        let response = self
            .client
            .get(&format!("{}/rates", self.base_url))
            .header("X-Client-ID", &self.client_id)
            .header("X-API-Signature", &self.api_signature_secret)
            .query(&[("from", from_currency), ("to", to_currency)])
            .send()
            .await?;

        if response.status().is_success() {
            let rate_data: serde_json::Value = response.json().await?;
            let rate = rate_data["rate"].as_f64()
                .ok_or("Invalid rate response")?;
            Ok(rate)
        } else {
            Err("Failed to get conversion rate".into())
        }
    }
}