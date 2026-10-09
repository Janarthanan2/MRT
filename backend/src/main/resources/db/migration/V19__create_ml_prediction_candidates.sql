CREATE TABLE ml_prediction_candidates (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    prediction_id BIGINT UNSIGNED NOT NULL,
    hsn_id BIGINT UNSIGNED NOT NULL,
    rank_position TINYINT UNSIGNED NOT NULL,
    confidence DECIMAL(8,7) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_ml_candidate_rank (prediction_id, rank_position),
    INDEX idx_ml_candidate_hsn (hsn_id),
    CONSTRAINT fk_ml_candidate_prediction
        FOREIGN KEY (prediction_id) REFERENCES ml_predictions(id) ON DELETE CASCADE,
    CONSTRAINT fk_ml_candidate_hsn
        FOREIGN KEY (hsn_id) REFERENCES hsn_codes(id)
) ENGINE=InnoDB;
