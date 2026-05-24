-- liquibase formatted sql
-- changeset leiria:008-create-user_vehicles

CREATE TABLE user_vehicles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_plate VARCHAR(10) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    fuel_type VARCHAR(50),
    size_category VARCHAR(5) DEFAULT 'C',
    vin VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, license_plate)
);
