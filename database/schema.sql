-- Create Database
CREATE DATABASE IF NOT EXISTS aakrittii_db;
USE aakrittii_db;

-- Table: Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In real app, use hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Folders (Events)
CREATE TABLE IF NOT EXISTS gallery_folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Images
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folder_id INT,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES gallery_folders(id) ON DELETE CASCADE
);

-- Insert Dummy Data
INSERT INTO admin_users (email, password_hash) VALUES ('admin@aakritii.org', '123456');

INSERT INTO gallery_folders (name, description) VALUES 
('Community Events', 'Gatherings and celebrations in the village'),
('Education Drive', 'Distributing books and learning materials');

INSERT INTO gallery_images (folder_id, image_url, description) VALUES
(1, 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000', 'Village gathering'),
(2, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000', 'Classroom session');
