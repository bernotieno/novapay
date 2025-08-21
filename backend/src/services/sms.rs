use std::collections::HashMap;

pub struct SmsService;

impl SmsService {
    pub fn new() -> Self {
        Self
    }

    pub async fn send_notification(
        &self,
        phone_number: &str,
        amount: f64,
        currency: &str,
        sender_name: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // For demo purposes, just log the SMS that would be sent
        // In production, integrate with SMS providers like Twilio, Africa's Talking, etc.
        
        let message = format!(
            "You have received {} {} from {}. Transaction completed via NovaPay. Thank you!",
            amount, currency, sender_name
        );
        
        println!("📱 SMS to {}: {}", phone_number, message);
        
        // Simulate SMS API call
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        Ok(())
    }
}