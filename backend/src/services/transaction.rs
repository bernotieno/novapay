use crate::models::{Transaction, CreateTransaction};
use crate::services::StellarService;
use sqlx::SqlitePool;
use uuid::Uuid;

pub struct TransactionService {
    stellar_service: StellarService,
}

impl TransactionService {
    pub fn new() -> Self {
        Self {
            stellar_service: StellarService::new(),
        }
    }

    pub async fn create_transaction(
        &self,
        pool: &SqlitePool,
        user_id: &str,
        create_tx: CreateTransaction,
    ) -> Result<Transaction, sqlx::Error> {
        let tx_id = Uuid::new_v4().to_string();
        let currency = create_tx.currency.unwrap_or_else(|| "USD".to_string());
        let target_currency = create_tx.target_currency.unwrap_or_else(|| "KES".to_string());

        let transaction = sqlx::query_as::<_, Transaction>(
            r#"
            INSERT INTO transactions (id, user_id, recipient_email, amount, currency, target_currency, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
            RETURNING *
            "#,
        )
        .bind(&tx_id)
        .bind(user_id)
        .bind(&create_tx.recipient_email)
        .bind(create_tx.amount)
        .bind(&currency)
        .bind(&target_currency)
        .fetch_one(pool)
        .await?;

        Ok(transaction)
    }

    pub async fn process_payment(
        &self,
        pool: &SqlitePool,
        transaction_id: &str,
        from_secret: &str,
        to_public: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        // Get transaction details
        let transaction = sqlx::query_as::<_, Transaction>(
            "SELECT * FROM transactions WHERE id = ?"
        )
        .bind(transaction_id)
        .fetch_one(pool)
        .await?;

        // Send payment via Stellar
        let tx_hash = self.stellar_service.send_payment(
            from_secret,
            to_public,
            transaction.amount,
            &transaction.target_currency,
        ).await?;

        // Update transaction with hash and status
        sqlx::query(
            "UPDATE transactions SET stellar_tx_hash = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
        .bind(&tx_hash)
        .bind(transaction_id)
        .execute(pool)
        .await?;

        Ok(tx_hash)
    }

    pub async fn get_user_transactions(
        &self,
        pool: &SqlitePool,
        user_id: &str,
    ) -> Result<Vec<Transaction>, sqlx::Error> {
        sqlx::query_as::<_, Transaction>(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC"
        )
        .bind(user_id)
        .fetch_all(pool)
        .await
    }
}