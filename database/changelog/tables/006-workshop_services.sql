-- liquibase formatted sql
-- changeset leiria:017-create-workshop-services

CREATE TABLE IF NOT EXISTS workshop_services (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'EM_ABERTO' 
        CHECK (status IN ('EM_ABERTO', 'EM_PROGRESSO', 'CONCLUIDO')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    entry_observations TEXT,
    entry_checks JSONB DEFAULT '[]'::jsonb,
    service_checks JSONB DEFAULT '[]'::jsonb,
    service_notes TEXT,
    estimated_value DECIMAL(10,2) DEFAULT 0.00,
    total_value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);