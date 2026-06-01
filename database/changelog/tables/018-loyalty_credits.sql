-- liquibase formatted sql
-- changeset leiria:018-create-loyalty-credits

CREATE TABLE IF NOT EXISTS loyalty_credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_earned INTEGER DEFAULT 0,
    available_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);