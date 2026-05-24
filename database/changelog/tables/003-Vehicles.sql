-- liquibase formatted sql
-- changeset leiria:003-create-vehicles

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    license_plate VARCHAR(20),
    CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);