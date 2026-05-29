-- liquibase formatted sql
-- changeset leiria:012-create-materials

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    purchase_url VARCHAR(500),
    image_file_id UUID REFERENCES File(Id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);