-- liquibase formatted sql
-- changeset leiria:004-create-bookings

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bay VARCHAR(50)
);