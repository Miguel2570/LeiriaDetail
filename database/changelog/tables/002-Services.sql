-- liquibase formatted sql
-- changeset leiria:002-create-services

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_ab DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    price_c DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    price_de DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER
);