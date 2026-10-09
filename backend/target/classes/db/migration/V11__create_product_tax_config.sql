CREATE TABLE product_tax_config (
    variant_id BIGINT UNSIGNED NOT NULL,
    hsn_id BIGINT UNSIGNED NOT NULL,
    tax_inclusive BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (variant_id),
    CONSTRAINT fk_tax_variant
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_tax_hsn
        FOREIGN KEY (hsn_id) REFERENCES hsn_codes(id)
) ENGINE=InnoDB;
