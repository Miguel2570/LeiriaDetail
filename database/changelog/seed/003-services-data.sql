-- liquibase formatted sql
-- changeset leiria:003-seed-services

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Exterior', 'Lavagem à mão + secar com pano de microfibra', 20, 30, 40, 30, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Interior', 'Aspiração, limpeza de plásticos (pano de microfibra)', 25, 35, 50, 45, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Interior' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Exterior e Interior', 'Junção dos dois serviços', 40, 55, 75, 60, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior e Interior' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Jantes e Pneus', 'Lavagem à mão', 15, 20, 25, 20, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes e Pneus' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Jantes, Pneus e Discos', 'Sem remoção da roda', 20, 25, 35, 30, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes, Pneus e Discos' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Completa', 'Exterior, interior, jantes, pneus e discos + oferta de ambientador', 55, 75, 100, 90, 'Básico'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Completa' AND pack_type = 'Básico');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Exterior', 'Snow-foam + pincéis + secar com pano de microfibra', 30, 40, 55, 45, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior' AND pack_type = 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Interior', 'Aspiração profunda, lavagem de estofos, detalhamento com pincel', 40, 50, 70, 60, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Interior' AND pack_type = 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Exterior e Interior', 'Junção dos dois serviços premium', 60, 75, 90, 90, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior e Interior' AND pack_type = 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Jantes e Pneus', 'Lavagem com piaçaba', 20, 25, 35, 30, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes e Pneus' AND pack_type = 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Jantes, Pneus e Discos', 'Com remoção da roda', 25, 30, 45, 40, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes, Pneus e Discos' AND pack_type = 'Premium');

INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
SELECT 'Lavagem Completa', 'Tratamento premium completo + oferta de ambientador', 80, 95, 120, 120, 'Premium'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Completa' AND pack_type = 'Premium');