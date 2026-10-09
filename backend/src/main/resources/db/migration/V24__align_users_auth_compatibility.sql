-- Add compatibility columns used by the existing REST API while retaining
-- the canonical status, first_name, last_name and email_verified_at fields.
-- This is additive so existing customer rows and IDs are preserved.
ALTER TABLE users
    ADD COLUMN name VARCHAR(200) NULL AFTER public_id,
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN account_locked BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE users
SET name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))),
    email_verified = (email_verified_at IS NOT NULL),
    account_locked = (status <> 'ACTIVE');
