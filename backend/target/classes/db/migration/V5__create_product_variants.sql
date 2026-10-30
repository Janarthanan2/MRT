CREATE TABLE product_variants (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(100) NOT NULL,
    variant_name VARCHAR(255),
    size VARCHAR(100),
    weight DECIMAL(12,3),
    weight_unit VARCHAR(10),
    price DECIMAL(15,2) NOT NULL,
    compare_at_price DECIMAL(15,2),
    cost_price DECIMAL(15,2),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    status ENUM('ACTIVE','INACTIVE','OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_variants_public_id (public_id),
    UNIQUE KEY uk_variants_sku (sku),
    INDEX idx_variants_product (product_id),
    CONSTRAINT fk_variants_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
