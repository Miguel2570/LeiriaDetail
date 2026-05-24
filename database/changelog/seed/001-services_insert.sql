-- liquibase formatted sql
-- changeset leiria:001-seed-services

-- Nota: Ajusta os preços conforme a tua tabela real do Excel
INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes) VALUES 
('Lavagem Premium', 'Lavagem exterior detalhada e aspiração.', 30.00, 35.00, 40.00, 120),
('Polimento e Correção de Pintura', 'Remoção de riscos e brilho.', 120.00, 140.00, 160.00, 480),
('Proteção Cerâmica', 'Coating cerâmico para proteção extrema.', 250.00, 280.00, 320.00, 720),
('Limpeza de Estofos', 'Higienização profunda.', 80.00, 90.00, 100.00, 180);