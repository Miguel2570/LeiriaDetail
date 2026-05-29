-- liquibase formatted sql
-- changeset leiria:009-create-portfolio

CREATE TABLE IF NOT EXISTS portfolio (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    main_image_file_id UUID REFERENCES File(Id) ON DELETE SET NULL,
    before_image_file_id UUID REFERENCES File(Id) ON DELETE SET NULL,
    after_image_file_id UUID REFERENCES File(Id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
