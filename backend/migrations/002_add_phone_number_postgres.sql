-- Add phone number field to users table (PostgreSQL version)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);