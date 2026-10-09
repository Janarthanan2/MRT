CREATE TABLE ml_predictions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED,
    input_text VARCHAR(1000) NOT NULL,
    predicted_hsn_id BIGINT UNSIGNED,
    confidence DECIMAL(8,7) NOT NULL,
    review_required BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('PREDICTED','ACCEPTED','REJECTED','OVERRIDDEN') NOT NULL DEFAULT 'PREDICTED',
    final_hsn_id BIGINT UNSIGNED,
    reviewed_by BIGINT UNSIGNED,
    reviewed_at DATETIME(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_ml_predictions_public_id (public_id),
    INDEX idx_ml_predictions_product (product_id),
    INDEX idx_ml_predictions_model (model_id),
    INDEX idx_ml_predictions_review (review_required, status),
    CONSTRAINT fk_ml_predictions_model
        FOREIGN KEY (model_id) REFERENCES ml_models(id),
    CONSTRAINT fk_ml_predictions_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    CONSTRAINT fk_ml_predictions_predicted_hsn
        FOREIGN KEY (predicted_hsn_id) REFERENCES hsn_codes(id),
    CONSTRAINT fk_ml_predictions_final_hsn
        FOREIGN KEY (final_hsn_id) REFERENCES hsn_codes(id),
    CONSTRAINT fk_ml_predictions_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
