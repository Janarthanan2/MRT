CREATE TABLE inventory_movements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    variant_id BIGINT UNSIGNED NOT NULL,
    movement_type ENUM('PURCHASE','SALE','RESERVATION','RELEASE','RETURN','ADJUSTMENT','DAMAGE') NOT NULL,
    quantity INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT UNSIGNED,
    reason VARCHAR(500),
    created_by BIGINT UNSIGNED,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_inventory_movements_variant_date (variant_id, created_at),
    INDEX idx_inventory_movements_reference (reference_type, reference_id),
    CONSTRAINT fk_inventory_movements_variant
        FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    CONSTRAINT fk_inventory_movements_user
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
