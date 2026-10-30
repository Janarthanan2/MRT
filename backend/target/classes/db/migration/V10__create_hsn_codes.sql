CREATE TABLE hsn_codes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    hsn_code VARCHAR(20) NOT NULL,
    description VARCHAR(500),
    gst_rate DECIMAL(5,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_hsn_code_date (hsn_code, effective_from),
    INDEX idx_hsn_code (hsn_code),
    INDEX idx_hsn_status (status)
) ENGINE=InnoDB;
