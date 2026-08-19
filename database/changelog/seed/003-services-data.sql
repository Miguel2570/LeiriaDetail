-- liquibase formatted sql
-- changeset leiria:003-seed-services-v3

-- ============================================
-- PACKS COMPLETOS
-- ============================================

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Pack Essencial',
  'Lavagem exterior + interior completa',
  'O pacote essencial para o dia a dia. Combina lavagem exterior e interior para um resultado completo. SUV +10€, Van +15€.',
  45, 55, 65,
  -- Tempo real baseado nas imagens: 1h22 real / estimado 1h30-2h
  82, '1h30 a 2h',
  'Pack',
  ARRAY[
    'Pré-lavagem com snow foam',
    'Lavagem manual exterior',
    'Secagem com panos microfibra',
    'Limpeza de jantes e pneus',
    'Aspiração completa',
    'Limpeza de plásticos interiores',
    'Limpeza de vidros',
    'Ambientador',
    'Brilho nos pneus'
  ],
  '[
    {"step":1,"title":"Pré-lavagem","duration_min":10,"description":"Aplicação de snow foam para soltar partículas."},
    {"step":2,"title":"Lavagem de jantes","duration_min":5,"description":"Limpeza detalhada de jantes e pneus."},
    {"step":3,"title":"Lavagem manual","duration_min":20,"description":"Lavagem manual com técnica de 2 baldes."},
    {"step":4,"title":"Secagem manual","duration_min":10,"description":"Secagem com panos de microfibra."},
    {"step":5,"title":"Limpeza de vidros","duration_min":5,"description":"Vidros sem marcas, interior e exterior."},
    {"step":6,"title":"Ambientador","duration_min":2,"description":"Aplicação de ambientador."},
    {"step":7,"title":"Aspiração simples","duration_min":15,"description":"Aspiração de tapetes e bancos."},
    {"step":8,"title":"Limpeza interior simples","duration_min":25,"description":"Limpeza de plásticos e superfícies interiores."}
  ]',
  '⭐', 10
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Pack Essencial' AND pack_type = 'Pack'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Pack Premium',
  'Detalhe completo interior e exterior com cera e purio',
  'Tratamento premium completo. Inclui lavagem exterior com cera, interior detalhado com purio, jantes e pneus. SUV +10€, Van +15€.',
  65,80, 90,
  -- Tempo real: 2h15 / estimado 3h-4h
  135, '3h a 4h',
  'Pack',
  ARRAY[
    'Pré-lavagem com snow foam',
    'Lavagem manual exterior',
    'Limpeza detalhada de jantes',
    'Secagem com panos microfibra',
    'Aspiração detalhada',
    'Lavagem de tapetes',
    'Lavagem do volante e travão de mão',
    'Limpeza de plásticos interiores',
    'Utilização do apc',
    'Limpeza de vidros',
    'Brilho nos pneus',
    'Ambientador'
  ],
  '[
    {"step":1,"title":"Pré-lavagem","duration_min":10,"description":"Snow foam para soltar toda a sujidade."},
    {"step":2,"title":"Lavagem de jantes","duration_min":5,"description":"Limpeza detalhada de jantes e pneus."},
    {"step":3,"title":"Lavagem manual","duration_min":20,"description":"Lavagem manual com técnica de 2 baldes."},
    {"step":4,"title":"Secagem manual","duration_min":10,"description":"Secagem com panos de microfibra."},
    {"step":5,"title":"Limpeza de vidros","duration_min":5,"description":"Vidros sem marcas, interior e exterior."},
    {"step":6,"title":"Ambientador","duration_min":2,"description":"Aplicação de ambientador."},
    {"step":7,"title":"Aspiração detalhada","duration_min":25,"description":"Aspiração profunda de todos os cantos."},
    {"step":8,"title":"Lavagem de tapetes","duration_min":15,"description":"Lavagem e secagem de tapetes."},
    {"step":9,"title":"Volante e travão de mão","duration_min":10,"description":"Limpeza e higienização do volante e travão."},
    {"step":10,"title":"Utilização do apc","duration_min":30,"description":"Desinfeção profunda com máquina apc."}
  ]',
  '💎', 15
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Pack Premium' AND pack_type = 'Pack'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Pack Showroom',
  'Acabamento próximo de showroom — o tratamento mais completo',
  'O tratamento mais completo disponível. Inclui tudo do Pack Premium + hidratação de plásticos exteriores, proteção UV interior, limpeza do motor e acabamento de showroom. SUV +10€, Van +15€.',
  120, 135, 140,
  -- Tempo real estimado 4h32 / estimado 5h-6h
  272, '5h a 6h',
  'Pack',
  ARRAY[
    'Pré-lavagem com snow foam',
    'Lavagem manual exterior',
    'Limpeza detalhada de jantes',
    'Secagem com panos microfibra',
    'Hidratação de plásticos (exterior)',
    'Lavagem dos estofos',
    'Lavagem de tapetes',
    'Aspiração detalhada',
    'Limpeza interior detalhada',
    'Lavagem do volante e travão de mão',
    'Proteção UV de plásticos (interior)',
    'Utilização do purio',
    'Limpeza de vidros',
    'Brilho nos pneus',
    'Ambientador'
  ],
  '[
    {"step":1,"title":"Pré-lavagem","duration_min":10,"description":"Snow foam para soltar toda a sujidade."},
    {"step":2,"title":"Lavagem de jantes","duration_min":5,"description":"Limpeza detalhada de jantes e pneus."},
    {"step":3,"title":"Lavagem manual","duration_min":20,"description":"Lavagem manual com técnica de 2 baldes."},
    {"step":4,"title":"Secagem manual","duration_min":10,"description":"Secagem com panos de microfibra."},
    {"step":5,"title":"Limpeza de vidros","duration_min":5,"description":"Vidros sem marcas, interior e exterior."},
    {"step":6,"title":"Ambientador","duration_min":2,"description":"Aplicação de ambientador."},
    {"step":7,"title":"Limpeza interior detalhada","duration_min":30,"description":"Limpeza profunda de todos os plásticos e superfícies."},
    {"step":8,"title":"Lavagem de tapetes","duration_min":15,"description":"Lavagem e secagem de tapetes."},
    {"step":9,"title":"Volante e travão de mão","duration_min":10,"description":"Limpeza e higienização do volante e travão."},
    {"step":10,"title":"Utilização do purio","duration_min":30,"description":"Desinfeção profunda com máquina purio."},
    {"step":11,"title":"Cera / Selante","duration_min":45,"description":"Proteção da pintura com cera de alta qualidade."},
    {"step":12,"title":"Hidratação plásticos exterior","duration_min":20,"description":"Hidratação de para-choques, frisos e plásticos exteriores."},
    {"step":13,"title":"Proteção UV interior","duration_min":20,"description":"Proteção UV em todos os plásticos interiores."},
    {"step":14,"title":"Limpeza do motor","duration_min":45,"description":"Limpeza e hidratação do compartimento do motor."},
    {"step":15,"title":"Brilho nos pneus","duration_min":5,"description":"Aplicação de produto de brilho nos pneus."}
  ]',
  '🏆', 25
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Pack Showroom' AND pack_type = 'Pack'
);

-- ============================================
-- EXTRAS (adicionáveis a packs)
-- ============================================

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Cera / Selante',
  'Aplicação de cera ou selante para proteção extra da pintura',
  'Proteção adicional para a pintura com cera de alta qualidade ou selante sintético. Prolonga o brilho e protege contra contaminantes.',
  10, 10, 10,
  45, '30min a 45min',
  'Extra',
  ARRAY['Aplicação de cera/selante', 'Buffing manual'],
  '[]',
  '🛡️', 2
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Cera / Selante' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Hidratação Plásticos Exterior',
  'Hidratação e restauro de plásticos exteriores',
  'Restauração e hidratação de todos os plásticos exteriores (para-choques, frisos, etc.) devolvendo o aspeto de novo.',
  10, 10, 10,
  20, '15min a 20min',
  'Extra',
  ARRAY['Limpeza de plásticos', 'Aplicação de hidratante'],
  '[]',
  '🖤', 2
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Hidratação Plásticos Exterior' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Proteção UV Interior',
  'Proteção UV para plásticos interiores contra descoloração',
  'Aplicação de proteção UV em todas as superfícies plásticas interiores para evitar descoloração e envelhecimento.',
  12, 12, 12,
  20, '15min a 20min',
  'Extra',
  ARRAY['Limpeza de superfícies', 'Aplicação de proteção UV'],
  '[]',
  '☀️', 2
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Proteção UV Interior' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza do Motor',
  'Limpeza e hidratação do compartimento do motor',
  'Limpeza profissional do compartimento do motor com produtos específicos. Remove sujidade acumulada e protege componentes.',
  25, 25, 25,
  45, '30min a 45min',
  'Extra',
  ARRAY[
    'Pré-limpeza do motor',
    'Aplicação de desengordurante',
    'Lavagem controlada',
    'Secagem',
    'Hidratação de plásticos e borrachas'
  ],
  '[]',
  '🔧', 5
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza do Motor' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Neutralização de Odores',
  'Tratamento com ozono para eliminar odores persistentes',
  'Eliminação profunda de odores (tabaco, animais, comida) através de tratamento com ozono. Renova completamente o ar interior.',
  30, 30, 30,
  45, '30min a 45min',
  'Extra',
  ARRAY[
    'Limpeza prévia do interior',
    'Tratamento com ozono',
    'Ventilação e neutralização'
  ],
  '[]',
  '🌬️', 5
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Neutralização de Odores' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Restauro de Faróis',
  'Recuperação de faróis baços ou amarelados',
  'Restauro completo de faróis com lixagem, polimento e selagem. Devolve a transparência original e melhora a visibilidade noturna.',
  35, 35, 35,
  90, '1h a 1h30',
  'Extra',
  ARRAY['Lixagem progressiva', 'Polimento', 'Selagem com proteção UV'],
  '[]',
  '💡', 7
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Restauro de Faróis' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Remoção de Pêlos de Animal',
  'Remoção profunda de pêlos de animal de estimação',
  'Remoção especializada de pêlos de animal de estimação em estofos, carpetes e tapetes com ferramentas específicas.',
  0, 0, 0,
  60, '30min a 1h (sob orçamento)',
  'Extra',
  ARRAY['Remoção com ferramentas específicas', 'Aspiração profunda'],
  '[]',
  '🐾', 0
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Remoção de Pêlos de Animal' AND pack_type = 'Extra'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Remoção de Calcário',
  'Remoção de manchas de calcário em vidros e pintura',
  'Tratamento especializado para remover depósitos de calcário em vidros, pintura e cromados sem danificar as superfícies.',
  0, 0, 0,
  60, '30min a 1h (sob orçamento)',
  'Extra',
  ARRAY[
    'Avaliação das áreas afetadas',
    'Aplicação de removedor específico',
    'Limpeza e neutralização'
  ],
  '[]',
  '💧', 0
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Remoção de Calcário' AND pack_type = 'Extra'
);

-- ============================================
-- LIMPEZA DE BANCOS (por material)
-- ============================================

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza de Bancos - Couro',
  'Limpeza profunda + hidratação de couro',
  'Tratamento completo para bancos em couro. Limpeza profunda com remoção de bactérias, seguida de hidratação para manter a flexibilidade e evitar rachas.',
  55, 55, 55,
  180, '2h a 3h',
  'Bancos',
  ARRAY[
    'Aspiração profunda',
    'Limpeza com produto específico para couro',
    'Hidratação do couro',
    'Proteção UV'
  ],
  '[]',
  '🪑', 10
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza de Bancos - Couro' AND pack_type = 'Bancos'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza de Bancos - Sintético',
  'Limpeza profunda + hidratação de material sintético',
  'Tratamento completo para bancos em material sintético. Limpeza profunda com remoção de bactérias e hidratação.',
  55, 55, 55,
  180, '2h a 3h',
  'Bancos',
  ARRAY[
    'Aspiração profunda',
    'Limpeza com produto específico',
    'Hidratação do material',
    'Proteção UV'
  ],
  '[]',
  '🪑', 10
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza de Bancos - Sintético' AND pack_type = 'Bancos'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza de Bancos - Alcântara',
  'Limpeza especializada para alcântara',
  'Tratamento delicado para bancos em alcântara. Limpeza com produtos específicos que preservam a textura e suavidade do material.',
  60, 60, 60,
  240, '3h a 4h',
  'Bancos',
  ARRAY[
    'Aspiração cuidadosa',
    'Limpeza com produto específico para alcântara',
    'Escovagem suave',
    'Proteção'
  ],
  '[]',
  '🪑', 12
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza de Bancos - Alcântara' AND pack_type = 'Bancos'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza de Bancos - Tecido',
  'Limpeza profunda de tecido com extração',
  'Limpeza profunda de bancos em tecido com máquina de extração. Remove nódoas, bactérias e odores incrustados.',
  60, 60, 60,
  240, '3h a 4h',
  'Bancos',
  ARRAY[
    'Aspiração profunda',
    'Aplicação de produto de limpeza',
    'Extração com máquina',
    'Secagem',
    'Proteção de tecido'
  ],
  '[]',
  '🪑', 12
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza de Bancos - Tecido' AND pack_type = 'Bancos'
);

INSERT INTO services (
  name, description, long_description,
  price_ab, price_c, price_de,
  duration_minutes, duration_details,
  pack_type, includes, process_steps, icon, loyalty_points
)
SELECT
  'Limpeza de Bancos - Misto',
  'Limpeza para veículos com 2 materiais diferentes',
  'Tratamento para veículos com bancos em 2 materiais diferentes (ex: couro + alcântara). Combina as técnicas adequadas a cada material.',
  65, 65, 65,
  270, '3h30 a 4h30',
  'Bancos',
  ARRAY[
    'Avaliação dos materiais',
    'Limpeza específica para cada material',
    'Hidratação/Proteção adequada a cada superfície'
  ],
  '[]',
  '🪑', 13
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Limpeza de Bancos - Misto' AND pack_type = 'Bancos'
);