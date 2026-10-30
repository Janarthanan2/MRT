CREATE TABLE payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    order_id BIGINT UNSIGNED NOT NULL,
    provider VARCHAR(50),
    provider_payment_id VARCHAR(255),
    method ENUM('COD','UPI','CARD','NET_BANKING','WALLET') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    status ENUM('PENDING','AUTHORIZED','CAPTURED','FAILED','REFUNDED','PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
    idempotency_key VARCHAR(100),
    paid_at DATETIME(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_payments_public_id (public_id),
    UNIQUE KEY uk_payments_provider_id (provider, provider_payment_id),
    UNIQUE KEY uk_payments_idempotency (idempotency_key),
    INDEX idx_payments_order (order_id),
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;
