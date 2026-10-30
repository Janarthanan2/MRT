CREATE TABLE roles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB;

CREATE TABLE permissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    permission_key VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_permissions_key (permission_key)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
) ENGINE=InnoDB;

INSERT INTO roles (name, description) VALUES
('CUSTOMER', 'Customer account'),
('STAFF', 'Store staff'),
('ADMIN', 'Administrator'),
('SUPER_ADMIN', 'Full system administrator');

INSERT INTO permissions (permission_key, description) VALUES
('product.read', 'View products'),
('product.create', 'Create products'),
('product.update', 'Update products'),
('product.delete', 'Delete products'),
('inventory.read', 'View inventory'),
('inventory.update', 'Update inventory'),
('order.read', 'View orders'),
('order.update', 'Update orders'),
('user.read', 'View users'),
('user.update', 'Update users'),
('ml.predict', 'Run ML predictions'),
('ml.review', 'Review ML predictions'),
('audit.read', 'View audit logs');
