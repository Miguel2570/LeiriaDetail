-- liquibase formatted sql
-- changeset leiria:010-create-reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    car VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);