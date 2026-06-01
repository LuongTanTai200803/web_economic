-- Tạo database (nếu chưa có)

CREATE DATABASE IF NOT EXISTS shoe_store;
USE shoe_store;

-- 1. Bảng users (người dùng)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- lưu mã hóa BCrypt
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng brands (thương hiệu)
CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Bảng colors (màu sắc)
CREATE TABLE colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Bảng products (sản phẩm)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(12,0) NOT NULL,      -- giá bán (VNĐ)
    stock INT NOT NULL DEFAULT 0,
    brand_id INT,
    color_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE SET NULL
);

-- 5. Bảng cart_items (giỏ hàng - mỗi user có nhiều dòng sản phẩm)
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)  -- tránh trùng sản phẩm trong giỏ
);

-- 6. Bảng orders (đơn hàng)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,0) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'COD',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 7. Bảng order_items (chi tiết đơn hàng)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,0) NOT NULL,   -- giá tại thời điểm mua
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ========== DỮ LIỆU MẪU (để demo) ==========

-- Thêm tài khoản admin & user (mật khẩu chưa mã hóa, khi dùng Spring Security sẽ mã hóa BCrypt)
-- Tạm thời để plain text, sau khi code sẽ mã hóa. Gợi ý: admin/123, user1/123
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2a$10$N.Zu9eKkX5Xy9MxQmYqUOeZbKcLdEfGhIjKlMnOpQrStUvWxYzA', 'admin@example.com', 'ADMIN'),
('user1',  '$2a$10$N.Zu9eKkX5Xy9MxQmYqUOeZbKcLdEfGhIjKlMnOpQrStUvWxYzA', 'user1@example.com', 'USER');

-- Thêm thương hiệu
INSERT INTO brands (name) VALUES ('Nike'), ('Adidas'), ('Puma'), ('Converse'), ('Vans');

-- Thêm màu sắc
INSERT INTO colors (name) VALUES ('Đen'), ('Trắng'), ('Đỏ'), ('Xanh'), ('Vàng'), ('Hồng');

-- Thêm sản phẩm mẫu
INSERT INTO products (name, description, price, stock, brand_id, color_id, image_url) VALUES
('Giày Nike Air Max', 'Giày thể thao thoải mái, đế Air Max', 2500000, 50, 1, 1, '/assets/img/product/p1.jpg'),
('Giày Adidas Ultraboost', 'Công nghệ đế Boost, êm ái', 3200000, 30, 2, 2, '/assets/img/product/p2.jpg'),
('Giày Puma Suede', 'Phong cách cổ điển', 1800000, 20, 3, 3, '/assets/img/product/p3.jpg'),
('Converse All Star', 'Vải bố, nhiều màu', 1200000, 100, 4, 4, '/assets/img/product/p4.jpg'),
('Vans Old Skool', 'Giày trượt ván biểu tượng', 2100000, 40, 5, 1, '/assets/img/product/p5.jpg'),
('Nike Air Force 1', 'Trắng tinh khôi, thời thượng', 2700000, 25, 1, 2, '/assets/img/product/p6.jpg'),
('Adidas Superstar', 'Shell toe huyền thoại', 2300000, 35, 2, 1, '/assets/img/product/p7.jpg'),
('Puma RS-X', 'Phối màu nổi bật', 2900000, 15, 3, 3, '/assets/img/product/p8.jpg'),
('Converse Run Star Hike', 'Đế cao, phong cách', 1950000, 10, 4, 6, '/assets/img/product/p9.jpg'),
('Vans Era', 'Kẹp viền, đơn giản', 1650000, 60, 5, 4, '/assets/img/product/p10.jpg');

-- Thêm vài sản phẩm có màu khác để minh họa lọc
INSERT INTO products (name, description, price, stock, brand_id, color_id, image_url) VALUES
('Nike Air Zoom', 'Màu đỏ thể thao', 2800000, 12, 1, 3, '/assets/img/product/p11.jpg'),
('Adidas Yeezy 350', 'Màu đen limited', 8500000, 5, 2, 1, '/assets/img/product/p12.jpg');
-- Thêm index (chạy sau khi tạo bảng)
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_product_color ON products(color_id);
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);