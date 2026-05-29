-- liquibase formatted sql
-- changeset leiria:016-create-portfolio-images

CREATE TABLE IF NOT EXISTS portfolio_images (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER NOT NULL REFERENCES portfolio(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES File(Id) ON DELETE CASCADE,
    type VARCHAR(10) DEFAULT 'gallery',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);