CREATE TABLE shipments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    carrier VARCHAR(100),
    tracking_number VARCHAR(255),
    status ENUM('PENDING','PACKED','SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','FAILED','RETURNED') NOT NULL DEFAULT 'PENDING',
    shipped_at DATETIME(6),
    delivered_at DATETIME(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_shipments_order (order_id),
    INDEX idx_shipments_tracking (tracking_number),
    CONSTRAINT fk_shipments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;
