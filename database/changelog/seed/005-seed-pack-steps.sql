-- liquibase formatted sql
-- changeset leiria:005-seed-pack-steps

-- ============================================================
-- TABELA DE PASSOS: service_steps
-- Estrutura relacional para os passos e tempos de cada pack.
--
-- Criar esta tabela primeiro (se ainda não existir):
--
--   CREATE TABLE IF NOT EXISTS service_steps (
--     id SERIAL PRIMARY KEY,
--     service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
--     step_order INT NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     duration_minutes INT NOT NULL DEFAULT 0,
--     UNIQUE(service_id, step_order)
--   );
-- ============================================================

-- ============================================
-- PASSOS: PACK ESSENCIAL (Soma dos passos: 92 min)
-- ============================================
WITH steps AS (
  SELECT 1 AS s_order, 'Pré-lavagem' AS s_title, 10 AS s_dur UNION ALL
  SELECT 2, 'Lavagem de jantes', 5 UNION ALL
  SELECT 3, 'Lavagem manual', 20 UNION ALL
  SELECT 4, 'Secagem manual', 10 UNION ALL
  SELECT 5, 'Limpeza de vidros', 5 UNION ALL
  SELECT 6, 'Ambientador', 2 UNION ALL
  SELECT 7, 'Aspiração simples', 15 UNION ALL
  SELECT 8, 'Limpeza de interior simples', 25
)
INSERT INTO service_steps (service_id, step_order, title, duration_minutes)
SELECT s.id, st.s_order, st.s_title, st.s_dur
FROM services s
CROSS JOIN steps st
WHERE s.name = 'Pack Essencial' AND s.pack_type = 'Pack'
AND NOT EXISTS (
  SELECT 1 FROM service_steps ss 
  WHERE ss.service_id = s.id AND ss.step_order = st.s_order
);

-- ============================================
-- PASSOS: PACK PREMIUM (Soma dos passos: 132 min)
-- ============================================
WITH steps AS (
  SELECT 1 AS s_order, 'Pré-lavagem' AS s_title, 10 AS s_dur UNION ALL
  SELECT 2, 'Lavagem de jantes', 5 UNION ALL
  SELECT 3, 'Lavagem manual', 20 UNION ALL
  SELECT 4, 'Secagem manual', 10 UNION ALL
  SELECT 5, 'Limpeza de vidros', 5 UNION ALL
  SELECT 6, 'Ambientador', 2 UNION ALL
  SELECT 7, 'Aspiração detalhada', 25 UNION ALL
  SELECT 8, 'Lavagem de tapetes', 15 UNION ALL
  SELECT 9, 'Lavagem do volante e travão de mão', 10 UNION ALL
  SELECT 10, 'Utilização do purio', 30
)
INSERT INTO service_steps (service_id, step_order, title, duration_minutes)
SELECT s.id, st.s_order, st.s_title, st.s_dur
FROM services s
CROSS JOIN steps st
WHERE s.name = 'Pack Premium' AND s.pack_type = 'Pack'
AND NOT EXISTS (
  SELECT 1 FROM service_steps ss 
  WHERE ss.service_id = s.id AND ss.step_order = st.s_order
);

-- ============================================
-- PASSOS: PACK SHOWROOM (Soma dos passos: 272 min)
-- ============================================
WITH steps AS (
  SELECT 1 AS s_order, 'Pré-lavagem' AS s_title, 10 AS s_dur UNION ALL
  SELECT 2, 'Lavagem de jantes', 5 UNION ALL
  SELECT 3, 'Lavagem manual', 20 UNION ALL
  SELECT 4, 'Secagem manual', 10 UNION ALL
  SELECT 5, 'Limpeza de vidros', 5 UNION ALL
  SELECT 6, 'Ambientador', 2 UNION ALL
  SELECT 7, 'Limpeza de interior detalhada', 30 UNION ALL
  SELECT 8, 'Lavagem de tapetes', 15 UNION ALL
  SELECT 9, 'Lavagem do volante e travão de mão', 10 UNION ALL
  SELECT 10, 'Utilização do purio', 30 UNION ALL
  SELECT 11, 'Cera / Selante', 45 UNION ALL
  SELECT 12, 'Hidratação plásticos (exterior)', 20 UNION ALL
  SELECT 13, 'Proteção UV plásticos (interior)', 20 UNION ALL
  SELECT 14, 'Limpeza do motor', 45 UNION ALL
  SELECT 15, 'Brilho pneus', 5
)
INSERT INTO service_steps (service_id, step_order, title, duration_minutes)
SELECT s.id, st.s_order, st.s_title, st.s_dur
FROM services s
CROSS JOIN steps st
WHERE s.name = 'Pack Showroom' AND s.pack_type = 'Pack'
AND NOT EXISTS (
  SELECT 1 FROM service_steps ss 
  WHERE ss.service_id = s.id AND ss.step_order = st.s_order
);