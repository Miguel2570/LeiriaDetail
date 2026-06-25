-- liquibase formatted sql
-- changeset leiria:004-seed-pack-extras

-- ============================================================
-- TABELA DE RELAÇÃO: pack_available_extras
-- Liga cada pack aos extras que o cliente pode adicionar.
--
-- Criar esta tabela primeiro (se ainda não existir):
--
--   CREATE TABLE IF NOT EXISTS pack_available_extras (
--     id              SERIAL PRIMARY KEY,
--     pack_id         INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
--     extra_id        INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
--     display_order   INT NOT NULL DEFAULT 0,
--     UNIQUE(pack_id, extra_id)
--   );
--
-- ============================================================

-- ============================================================
-- EXTRAS DO PACK ESSENCIAL
-- (fonte: imagem Pack Essencial — coluna "Extras")
--   Cera/Selante           → 10€
--   Hidratação Plásticos   → 10€
--   Proteção UV Interior   → 12€
--   Limpeza do Motor       → 25€
--   Neutralização de Odores→ 30€
--   Restauro de Faróis     → 35€
-- ============================================================

INSERT INTO pack_available_extras (pack_id, extra_id, display_order)
SELECT
  p.id,
  e.id,
  row_number() OVER (ORDER BY e.name) - 1
FROM services p
CROSS JOIN services e
WHERE p.name = 'Pack Essencial' AND p.pack_type = 'Pack'
  AND e.pack_type = 'Extra'
  AND e.name IN (
    'Cera / Selante',
    'Hidratação Plásticos Exterior',
    'Proteção UV Interior',
    'Limpeza do Motor',
    'Neutralização de Odores',
    'Restauro de Faróis'
  )
ON CONFLICT (pack_id, extra_id) DO NOTHING;

-- ============================================================
-- EXTRAS DO PACK PREMIUM
-- (fonte: imagem Pack Premium — coluna "Extras")
--   Cera/Selante           → 10€
--   Hidratação Plásticos   → 10€
--   Proteção UV Interior   → 12€
--   Limpeza do Motor       → 25€
--   Neutralização de Odores→ 30€
--   Restauro de Faróis     → 35€
-- ============================================================

INSERT INTO pack_available_extras (pack_id, extra_id, display_order)
SELECT
  p.id,
  e.id,
  row_number() OVER (ORDER BY e.name) - 1
FROM services p
CROSS JOIN services e
WHERE p.name = 'Pack Premium' AND p.pack_type = 'Pack'
  AND e.pack_type = 'Extra'
  AND e.name IN (
    'Cera / Selante',
    'Hidratação Plásticos Exterior',
    'Proteção UV Interior',
    'Limpeza do Motor',
    'Neutralização de Odores',
    'Restauro de Faróis'
  )
ON CONFLICT (pack_id, extra_id) DO NOTHING;

-- ============================================================
-- EXTRAS DO PACK SHOWROOM
-- (fonte: imagem Pack Showroom — coluna "Extras")
--   Restauro de Faróis     → 60€  (preço diferente!)
--   Remoção de Pêlos       → sob orçamento
--   Remoção de Calcário    → sob orçamento
--
-- NOTA: O Pack Showroom já inclui Cera, Hidratação Plásticos,
-- Proteção UV e Limpeza do Motor — por isso não aparecem como
-- extras disponíveis (já estão incluídos no pack base).
-- ============================================================

INSERT INTO pack_available_extras (pack_id, extra_id, display_order)
SELECT
  p.id,
  e.id,
  row_number() OVER (ORDER BY e.name) - 1
FROM services p
CROSS JOIN services e
WHERE p.name = 'Pack Showroom' AND p.pack_type = 'Pack'
  AND e.pack_type = 'Extra'
  AND e.name IN (
    'Restauro de Faróis',
    'Remoção de Pêlos de Animal',
    'Remoção de Calcário'
  )
ON CONFLICT (pack_id, extra_id) DO NOTHING;