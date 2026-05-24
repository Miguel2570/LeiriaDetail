-- liquibase formatted sql
-- changeset leiria:seed-services

-- ============================================
-- PACK BÁSICO (3 preços: Citadino, Luxo, Premium)
-- ============================================

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Exterior', 'Lavagem à mão + secar com pano de microfibra', 20, 30, 40, 30, 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Interior', 'Aspiração, limpeza de plásticos (pano de microfibra)', 25, 35, 50, 45, 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Exterior e Interior', 'Junção dos dois serviços', 40, 55, 75, 60, 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Jantes e Pneus', 'Lavagem à mão', 15, 20, 25, 20, 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Jantes, Pneus e Discos', 'Sem remoção da roda', 20, 25, 35, 30, 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Completa', 'Exterior, interior, jantes, pneus e discos + oferta de ambientador', 55, 75, 100, 90, 'Básico');


-- ============================================
-- PACK PREMIUM (3 preços: Citadino, Luxo, Premium)
-- ============================================

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Exterior', 'Snow-foam + pincéis + secar com pano de microfibra', 30, 40, 55, 45, 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Interior', 'Aspiração profunda, lavagem de estofos, detalhamento com pincel', 40, 50, 70, 60, 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Exterior e Interior', 'Junção dos dois serviços premium', 60, 75, 90, 90, 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Jantes e Pneus', 'Lavagem com piaçaba', 20, 25, 35, 30, 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Jantes, Pneus e Discos', 'Com remoção da roda', 25, 30, 45, 40, 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type) VALUES
('Lavagem Completa', 'Tratamento premium completo + oferta de ambientador', 80, 95, 120, 120, 'Premium');