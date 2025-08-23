#!/bin/bash

# Database backup script for production

set -e

BACKUP_DIR="/opt/novapay/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="novapay"

echo "💾 Starting database backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# PostgreSQL backup
if [ "$DATABASE_URL" ]; then
    echo "📦 Creating PostgreSQL backup..."
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/novapay_$DATE.sql"
    
    # Compress backup
    gzip "$BACKUP_DIR/novapay_$DATE.sql"
    
    echo "✅ Backup created: novapay_$DATE.sql.gz"
    
    # Keep only last 7 days of backups
    find $BACKUP_DIR -name "novapay_*.sql.gz" -mtime +7 -delete
    
    echo "🧹 Old backups cleaned up"
else
    echo "❌ DATABASE_URL not set"
    exit 1
fi

echo "✅ Backup completed successfully!"