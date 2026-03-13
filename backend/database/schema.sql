-- JALSANKALP Smart Water Pump Monitoring System Database Schema

CREATE DATABASE IF NOT EXISTS jalsankalp_db;
USE jalsankalp_db;

-- Create database user and grant privileges
CREATE USER IF NOT EXISTS 'jalsankalp_user'@'localhost' IDENTIFIED BY 'jalsankalp_pass123';
GRANT ALL PRIVILEGES ON jalsankalp_db.* TO 'jalsankalp_user'@'localhost';
FLUSH PRIVILEGES;

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS Admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Area Table
CREATE TABLE IF NOT EXISTS Area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pump Table
CREATE TABLE IF NOT EXISTS Pump (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    installation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES Area(id) ON DELETE CASCADE
);

-- 4. Operator Table
CREATE TABLE IF NOT EXISTS Operator (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    assigned_area_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_area_id) REFERENCES Area(id) ON DELETE SET NULL
);

-- 5. PumpLog Table
CREATE TABLE IF NOT EXISTS PumpLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pump_id INT NOT NULL,
    operator_id INT NOT NULL,
    action ENUM('start', 'stop', 'report') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT DEFAULT 0 COMMENT 'Duration in minutes (calculated on stop)',
    notes TEXT,
    photo_url VARCHAR(255),
    FOREIGN KEY (pump_id) REFERENCES Pump(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES Operator(id) ON DELETE CASCADE
);

-- 6. Villager Table
CREATE TABLE IF NOT EXISTS Villager (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Complaint Table
CREATE TABLE IF NOT EXISTS Complaint (
    id INT AUTO_INCREMENT PRIMARY KEY,
    villager_id INT NOT NULL,
    pump_id INT NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    status ENUM('pending', 'resolved') DEFAULT 'pending',
    admin_notes TEXT,
    resolution_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (villager_id) REFERENCES Villager(id) ON DELETE CASCADE,
    FOREIGN KEY (pump_id) REFERENCES Pump(id) ON DELETE CASCADE
);

-- 8. Feedback Table
CREATE TABLE IF NOT EXISTS Feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    villager_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (villager_id) REFERENCES Villager(id) ON DELETE CASCADE
);

-- Sample Seed Data Removed
