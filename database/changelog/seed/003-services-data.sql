-- liquibase formatted sql

-- changeset leiriadetail:seed-real-services
-- Limpar os serviços antigos
TRUNCATE TABLE services CASCADE;

-- Inserir os teus serviços reais! (Duração estimada em minutos para referência na agenda)
INSERT INTO services (name, description, duration_minutes, price_ab, price_c, price_de) VALUES 
('Lavagem Detalhada', 'Lavagem manual premium com descontaminação leve.', 90, 30.00, 35.00, 40.00),
('Detalhe Interior', 'Limpeza profunda de estofos, plásticos e hidratação.', 180, 80.00, 90.00, 100.00),
('Polimento 1 Fase', 'Correção de pintura leve para remover swirls e puxar brilho.', 300, 120.00, 140.00, 160.00),
('Detalhe Completo', 'Exterior e Interior tratados com a máxima atenção ao detalhe.', 480, 180.00, 210.00, 240.00),
('Proteção Cerâmica', 'Revestimento cerâmico para proteção extrema e hidrofobia.', 600, 250.00, 280.00, 320.00);