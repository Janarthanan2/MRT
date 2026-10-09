CREATE TABLE product_reviews (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED,
    rating TINYINT UNSIGNED NOT NULL,
    title VARCHAR(255),
    review_text TEXT,
    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_product_review_user (user_id, product_id),
    INDEX idx_reviews_product (product_id),
    CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
