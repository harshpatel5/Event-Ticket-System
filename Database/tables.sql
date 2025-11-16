-- Event Ticketing System Database Schema
-- Phase II - Relational Tables
CREATE SCHEMA event_ticketing;
USE event_ticketing;  

CREATE TABLE CATEGORY (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE VENUE (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    phone VARCHAR(15)
);


CREATE TABLE EVENT (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    description TEXT,
    organizer_name VARCHAR(100) NOT NULL,
    organizer_email VARCHAR(100),
    category_id INT NOT NULL,
    venue_id INT NOT NULL,
    total_tickets INT NOT NULL CHECK (total_tickets > 0),
    tickets_sold INT DEFAULT 0 CHECK (tickets_sold >= 0),
    status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (venue_id) REFERENCES VENUE(venue_id) ON DELETE RESTRICT,
    CHECK (tickets_sold <= total_tickets)
);


CREATE TABLE TICKET (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    ticket_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity_available INT NOT NULL CHECK (quantity_available >= 0),
    FOREIGN KEY (event_id) REFERENCES EVENT(event_id) ON DELETE CASCADE
);

CREATE TABLE CUSTOMER (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    registration_date DATE NOT NULL
);


CREATE TABLE PURCHASE (
    purchase_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    purchase_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method ENUM('Credit Card', 'Debit Card', 'PayPal', 'Cash') NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
);


CREATE TABLE PURCHASE_TICKET (
    purchase_ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    ticket_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (purchase_id) REFERENCES PURCHASE(purchase_id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES TICKET(ticket_id) ON DELETE RESTRICT,
    UNIQUE (purchase_id, ticket_id)
);

ALTER TABLE CUSTOMER
ADD COLUMN password_hash VARCHAR(255) NOT NULL AFTER email,
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER password_hash;
