CREATE TABLE products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id CHAR(36) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(300) NOT NULL,
    description TEXT,
    brand VARCHAR(150),
    material VARCHAR(100),
    status ENUM('DRAFT','ACTIVE','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    created_by BIGINT UNSIGNED,
    updated_by BIGINT UNSIGNED,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_products_public_id (public_id),
    UNIQUE KEY uk_products_slug (slug),
    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_created (created_at),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_products_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;
