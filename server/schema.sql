-- 在 phpMyAdmin 的「SQL」分頁貼上整段執行，或用 `mysql -u root -p < server/schema.sql` 匯入。
CREATE DATABASE IF NOT EXISTS cotrace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cotrace;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
