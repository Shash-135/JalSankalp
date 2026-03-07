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

-- Sample Seed Data
INSERT INTO Admin (name, email, password_hash) VALUES 
('Super Admin', 'admin@jalsankalp.local', '$2b$10$CeXasC0iHezxB4gdZLVUyfBw6aP6i1CnZ.sOqEq7m.OaX0tI/N5h2'); -- Password: password123

INSERT INTO Area (name, pincode) VALUES 
('North Gram Panchayat', '411001'),
('South Gram Panchayat', '411002'),
('East Gram Panchayat', '411003'),
('West Gram Panchayat', '411004'),
('Central Square', '411005'),
('River Side', '411006');

INSERT INTO Pump (area_id, qr_code, name, status, installation_date) VALUES 
(1, 'QR_PUMP_001', 'Main Village Borewell', 'active', '2023-01-15'),
(2, 'QR_PUMP_002', 'Market Square Pump', 'maintenance', '2022-11-20'),
(3, 'QR_PUMP_003', 'East Village Pump 1', 'active', '2023-05-10'),
(4, 'QR_PUMP_004', 'West Village Pump 2', 'active', '2023-06-15'),
(5, 'QR_PUMP_005', 'Central High Capacity Pump', 'inactive', '2021-02-20'),
(6, 'QR_PUMP_006', 'River Side Farm Pump', 'maintenance', '2022-08-05'),
(1, 'QR_PUMP_007', 'North Sub-pump A', 'active', '2024-01-10');

INSERT INTO Operator (name, mobile, password_hash, assigned_area_id, status) VALUES 
('Ramesh Kumar', '9876543210', '$2b$10$X1zJ.h.c0vA3T1Z2Y1h4o.J/w4V4R8E6lK7.8V7a/B9eRn3fQ3tRy', 1, 'active'), -- Password: password123
('Vikram Singh', '9876543220', '$2b$10$X1zJ.h.c0vA3T1Z2Y1h4o.J/w4V4R8E6lK7.8V7a/B9eRn3fQ3tRy', 3, 'active'),
('Amit Patel', '9876543221', '$2b$10$X1zJ.h.c0vA3T1Z2Y1h4o.J/w4V4R8E6lK7.8V7a/B9eRn3fQ3tRy', 4, 'active'),
('Neha Sharma', '9876543222', '$2b$10$X1zJ.h.c0vA3T1Z2Y1h4o.J/w4V4R8E6lK7.8V7a/B9eRn3fQ3tRy', 5, 'inactive');

INSERT INTO Villager (mobile, name) VALUES 
('9876543211', 'Suresh Patel'),
('9876543212', 'Sunita Sharma');

INSERT INTO Complaint (villager_id, pump_id, issue_type, description, status) VALUES 
(1, 1, 'low_pressure', 'Water pressure is very low since yesterday', 'pending'),
(2, 2, 'no_water', 'Pump is not dispensing any water', 'resolved'),
(1, 3, 'motor_noise', 'Loud grinding noise from motor', 'pending'),
(2, 4, 'leakage', 'Water leaking from the main pipe', 'pending'),
(1, 5, 'no_power', 'Pump not turning on at all', 'resolved'),
(2, 6, 'low_pressure', 'Takes 2 hours to fill tank', 'pending');

INSERT INTO PumpLog (pump_id, operator_id, action, notes) VALUES 
(1, 1, 'start', 'Routine morning start'),
(1, 1, 'stop', 'Routine stop');
