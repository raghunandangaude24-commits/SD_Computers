-- ============================================================
-- SD COMPUTERS — database schema
-- Database: student_management
-- Run via:  npm run init-db   (inside backend/)
-- ============================================================

-- ------------------------------------------------------------
-- USERS
-- The Register page collects name, email, phone and password.
-- Passwords are stored as bcrypt hashes, never plain text.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- PRODUCTS
-- Mirrors exactly what the existing Search Results page displays:
-- name, image, price, oldPrice, discount, brand, category, specs.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2) NULL DEFAULT NULL,
  discount VARCHAR(10) NULL DEFAULT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  specifications TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_brand (brand),
  KEY idx_products_category (category),
  KEY idx_products_price (price)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SEED DATA (the exact 8 products already hardcoded in the UI)
-- specifications is stored as a JSON array string.
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (id, name, brand, category, price, old_price, discount, image, specifications)
VALUES
  (1, 'MSI GeForce RTX 4060 Ventus 2X 8GB GDDR6', 'MSI', 'Graphics Cards (GPU)', 34999.00, 37999.00, '8% OFF', '/products/msi-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (2, 'Gigabyte GeForce RTX 4060 Eagle 8GB GDDR6', 'Gigabyte', 'Graphics Cards (GPU)', 33499.00, 36999.00, '9% OFF', '/products/gigabyte-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (3, 'ASUS Dual GeForce RTX 4060 8GB GDDR6', 'ASUS', 'Graphics Cards (GPU)', 34499.00, 38999.00, '11% OFF', '/products/asus-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (4, 'Zotac Gaming GeForce RTX 4060 Twin Edge 8GB GDDR6', 'Zotac', 'Graphics Cards (GPU)', 32999.00, 36499.00, '10% OFF', '/products/zotac-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (5, 'Palit GeForce RTX 4060 Dual 8GB GDDR6', 'Palit', 'Graphics Cards (GPU)', 32499.00, 35999.00, '10% OFF', '/products/palit-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (6, 'Inno3D GeForce RTX 4060 TWIN X2 8GB GDDR6', 'Inno3D', 'Graphics Cards (GPU)', 31999.00, 35499.00, '10% OFF', '/products/inno3d-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (7, 'ASUS TUF Gaming GeForce RTX 4060 8GB GDDR6', 'ASUS', 'Graphics Cards (GPU)', 36999.00, NULL, NULL, '/products/asus-tuf-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]'),
  (8, 'Gigabyte RTX 4060 Gaming OC 8GB GDDR6', 'Gigabyte', 'Graphics Cards (GPU)', 38499.00, 42999.00, '10% OFF', '/products/gigabyte-gaming-rtx-4060.png', '["8GB GDDR6","128-bit","DLSS 3"]');