-- liquibase formatted sql
-- changeset leiria:005-seed-services

INSERT INTO services (name, description, price, duration_minutes) VALUES 
('Lavagem Premium', 'Lavagem exterior detalhada com cera e aspiração interior profunda.', 35.00, 120),
('Polimento e Correção de Pintura', 'Remoção de riscos (swirls) e devolução do brilho original da pintura.', 150.00, 480),
('Proteção Cerâmica', 'Aplicação de coating cerâmico para proteção duradoura e brilho extremo.', 300.00, 720),
('Limpeza de Estofos', 'Higienização e remoção de nódoas em estofos de tecido ou hidratação de pele.', 60.00, 180);