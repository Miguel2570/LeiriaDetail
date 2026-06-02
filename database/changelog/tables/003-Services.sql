-- liquibase formatted sql
-- changeset leiria:002-create-services

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    price_ab DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    price_c DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    price_de DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER DEFAULT 60,
    duration_details TEXT,
    pack_type VARCHAR(50) NOT NULL DEFAULT 'Básico',
    includes TEXT[] DEFAULT '{}',
    process_steps JSONB DEFAULT '[]',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);