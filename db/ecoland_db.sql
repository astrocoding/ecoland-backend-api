CREATE DATABASE ecoland_rental;

USE ecoland_rental;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE lands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  size DECIMAL(10, 2) NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  land_id INT NOT NULL,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  FOREIGN KEY (land_id) REFERENCES lands(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(255) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
);