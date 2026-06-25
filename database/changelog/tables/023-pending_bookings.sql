-- liquibase formatted sql
-- changeset leiria:023-create-pending-bookings


CREATE TABLE IF NOT EXISTS pending_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES user_vehicles(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    service_name VARCHAR(255),
    vehicle_name VARCHAR(255),
    vehicle_plate VARCHAR(20),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) DEFAULT 'mbway',
    invoice_nif VARCHAR(9),
    invoice_name VARCHAR(255),
    invoice_address TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    CONSTRAINT fk_pending_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pending_vehicle FOREIGN KEY (vehicle_id) REFERENCES user_vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_pending_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
