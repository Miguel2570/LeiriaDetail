-- liquibase formatted sql
-- changeset leiria:007-seed-blocked-dates

-- Feriados nacionais 2026 (recorrentes)
INSERT INTO blocked_dates (date, reason, is_recurring) VALUES
('2026-01-01', 'Ano Novo', true),
('2026-04-03', 'Sexta-feira Santa', false),
('2026-04-05', 'Páscoa', false),
('2026-04-25', 'Dia da Liberdade', true),
('2026-05-01', 'Dia do Trabalhador', true),
('2026-06-10', 'Dia de Portugal', true),
('2026-06-11', 'Corpo de Deus', false),
('2026-08-15', 'Assunção de Nossa Senhora', true),
('2026-10-05', 'Implantação da República', true),
('2026-11-01', 'Todos os Santos', true),
('2026-12-01', 'Restauração da Independência', true),
('2026-12-08', 'Imaculada Conceição', true),
('2026-12-25', 'Natal', true);