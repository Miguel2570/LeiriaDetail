-- liquibase formatted sql
-- changeset leiria:015-create-blocked-dates
CREATE TABLE IF NOT EXISTS blocked_dates (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    reason VARCHAR(255) NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE, -- Feriados fixos anuais
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);