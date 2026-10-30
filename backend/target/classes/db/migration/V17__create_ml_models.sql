CREATE TABLE ml_models (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    artifact_uri VARCHAR(1000),
    framework VARCHAR(100),
    accuracy DECIMAL(7,5),
    weighted_f1 DECIMAL(7,5),
    status ENUM('TRAINING','VALIDATING','ACTIVE','DEPRECATED') NOT NULL DEFAULT 'TRAINING',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_ml_model_version (model_name, model_version)
) ENGINE=InnoDB;

INSERT INTO ml_models
(model_name, model_version, model_type, framework, status)
VALUES
('MRT-HSN-Classifier','v1.0.0','TFIDF_LOGISTIC_REGRESSION','scikit-learn','ACTIVE');
