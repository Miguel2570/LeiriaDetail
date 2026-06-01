-- liquibase formatted sql
-- changeset leiria:008-seed-settings

INSERT INTO settings (key, value, description) VALUES
('iva_enabled', 'false', 'Ativar/desativar cálculo de IVA nos preços'),
('iva_rate', '23', 'Taxa de IVA em percentagem'),
('require_nif', 'false', 'Exigir NIF do cliente'),
('company_name', 'LeiriaDetail', 'Nome da empresa'),
('company_address', 'Leiria, Portugal', 'Morada da empresa')
ON CONFLICT (key) DO NOTHING;