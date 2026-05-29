-- liquibase formatted sql
-- changeset leiria:014-create-payments

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(20) NOT NULL, -- 'mbway', 'multibanco'
    status VARCHAR(20) DEFAULT 'PENDENTE', -- 'PENDENTE', 'PAGO', 'CANCELADO'
    entity VARCHAR(10),
    reference VARCHAR(20),
    mbway_phone VARCHAR(20),
    invoice_nif VARCHAR(9),
    invoice_name VARCHAR(255),
    invoice_address TEXT,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);