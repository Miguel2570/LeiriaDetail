-- liquibase formatted sql
-- changeset leiria:003-seed-services

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Exterior', 'Lavagem à mão + secar com pano de microfibra', 
       'Lavagem exterior profissional que remove toda a sujidade acumulada, preparando a pintura para receber tratamentos mais profundos.',
       20, 30, 40, 30, '30 a 45 minutos dependendo do tamanho do veículo', 'Básico',
       ARRAY['Pré-lavagem com snow foam', 'Lavagem à mão com técnica 2 baldes', 'Secagem com pano de microfibra', 'Limpeza de vidros exteriores'],
       '[{"step":1,"title":"Pré-lavagem","description":"Aplicação de snow foam para remover partículas soltas sem riscar a pintura."},{"step":2,"title":"Lavagem à mão","description":"Utilizamos a técnica dos 2 baldes com luvas de microfibra."},{"step":3,"title":"Secagem","description":"Secagem completa com panos de microfibra que não largam pelos."}]',
       '🧼'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior' AND pack_type = 'Básico');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Interior', 'Aspiração, limpeza de plásticos (pano de microfibra)',
       'Limpeza profunda do interior do seu veículo, removendo pó, areias e sujidade de todas as superfícies.',
       25, 35, 50, 45, '45 a 60 minutos', 'Básico',
       ARRAY['Aspiração completa', 'Limpeza de plásticos e superfícies', 'Limpeza de vidros interiores', 'Hidratação de borrachas'],
       '[{"step":1,"title":"Aspiração","description":"Aspiração profunda de tapetes, carpetes, bancos e bagageira."},{"step":2,"title":"Superfícies","description":"Limpeza de todas as superfícies plásticas com produtos específicos."},{"step":3,"title":"Vidros","description":"Limpeza de vidros interiores sem deixar marcas."}]',
       '🪣'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Interior' AND pack_type = 'Básico');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Exterior e Interior', 'Junção dos dois serviços',
       'O pacote completo para o seu veículo. Combinação da lavagem exterior e interior para um resultado impecável.',
       40, 55, 75, 60, '60 a 90 minutos', 'Básico',
       ARRAY['Tudo da Lavagem Exterior', 'Tudo da Lavagem Interior', 'Ambientador oferta'],
       '[]',
       '🚗'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior e Interior' AND pack_type = 'Básico');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Jantes e Pneus', 'Lavagem à mão',
       'Limpeza detalhada das jantes e pneus para remover pó de travão e sujidade acumulada.',
       15, 20, 25, 20, '20 a 30 minutos', 'Básico',
       ARRAY['Limpeza de jantes', 'Limpeza de pneus', 'Aplicação de brilho'],
       '[]',
       '🛞'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes e Pneus' AND pack_type = 'Básico');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Jantes, Pneus e Discos', 'Sem remoção da roda',
       'Limpeza completa do sistema de rodas incluindo discos de travão visíveis.',
       20, 25, 35, 30, '30 a 40 minutos', 'Básico',
       ARRAY['Limpeza de jantes', 'Limpeza de pneus', 'Limpeza de discos', 'Aplicação de brilho'],
       '[]',
       '🔧'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes, Pneus e Discos' AND pack_type = 'Básico');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Completa', 'Exterior, interior, jantes, pneus e discos + oferta de ambientador',
       'O tratamento mais completo da categoria Básico. Tudo o que o seu carro precisa num só serviço.',
       55, 75, 100, 90, '90 a 120 minutos', 'Básico',
       ARRAY['Lavagem exterior completa', 'Lavagem interior completa', 'Jantes, pneus e discos', 'Ambientador oferta'],
       '[]',
       '⭐'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Completa' AND pack_type = 'Básico');

-- Premium
INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Exterior', 'Snow-foam + pincéis + secar com pano de microfibra',
       'Lavagem exterior premium com produtos de alta qualidade e técnicas avançadas para um acabamento superior.',
       30, 40, 55, 45, '45 a 60 minutos', 'Premium',
       ARRAY['Snow foam premium', 'Lavagem à mão com técnica 2 baldes', 'Secagem com pano de microfibra', 'Limpeza de jantes com pincéis', 'Aplicação de cera líquida'],
       '[{"step":1,"title":"Snow Foam Premium","description":"Espuma de alta qualidade que remove sujidade sem riscar."},{"step":2,"title":"Lavagem Detalhada","description":"Técnica 2 baldes com luvas de microfibra premium."},{"step":3,"title":"Jantes e Pneus","description":"Limpeza com pincéis específicos para cada área."},{"step":4,"title":"Cera Líquida","description":"Aplicação de cera para proteção e brilho extra."}]',
       '👑'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior' AND pack_type = 'Premium');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Interior', 'Aspiração profunda, lavagem de estofos, detalhamento com pincel',
       'Limpeza interior premium com aspiração profunda, lavagem de estofos e detalhamento com pincéis específicos.',
       40, 50, 70, 60, '60 a 90 minutos', 'Premium',
       ARRAY['Aspiração profunda', 'Lavagem de estofos', 'Detalhamento com pincéis', 'Hidratação de couro', 'Limpeza de vidros interior'],
       '[]',
       '✨'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Interior' AND pack_type = 'Premium');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Exterior e Interior', 'Junção dos dois serviços premium',
       'O melhor dos dois mundos premium. Exterior e interior tratados ao pormenor.',
       60, 75, 90, 90, '90 a 120 minutos', 'Premium',
       ARRAY['Tudo da Lavagem Exterior Premium', 'Tudo da Lavagem Interior Premium', 'Ambientador premium'],
       '[]',
       '💎'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Exterior e Interior' AND pack_type = 'Premium');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Jantes e Pneus', 'Lavagem com piaçaba',
       'Limpeza premium de jantes e pneus com ferramentas específicas para um acabamento perfeito.',
       20, 25, 35, 30, '30 a 40 minutos', 'Premium',
       ARRAY['Limpeza com piaçaba', 'Descontaminação de jantes', 'Aplicação de selante'],
       '[]',
       '🛞'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes e Pneus' AND pack_type = 'Premium');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Jantes, Pneus e Discos', 'Com remoção da roda',
       'O tratamento mais completo para rodas. Remoção da roda para limpeza total.',
       25, 30, 45, 40, '40 a 60 minutos', 'Premium',
       ARRAY['Remoção da roda', 'Limpeza profunda de jantes', 'Limpeza de discos', 'Aplicação de proteção'],
       '[]',
       '🔧'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Jantes, Pneus e Discos' AND pack_type = 'Premium');

INSERT INTO services (name, description, long_description, price_ab, price_c, price_de, duration_minutes, duration_details, pack_type, includes, process_steps, icon)
SELECT 'Lavagem Completa', 'Tratamento premium completo + oferta de ambientador',
       'A experiência definitiva de detalhe automóvel. O melhor tratamento que pode dar ao seu carro.',
       80, 95, 120, 120, '120 a 180 minutos', 'Premium',
       ARRAY['Lavagem exterior premium', 'Lavagem interior premium', 'Jantes, pneus e discos premium', 'Cera de proteção', 'Ambientador premium'],
       '[]',
       '👑'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Lavagem Completa' AND pack_type = 'Premium');