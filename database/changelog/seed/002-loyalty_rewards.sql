-- liquibase formatted sql
-- changeset leiria:002-insert-loyalty-rewards

INSERT INTO loyalty_rewards (name, description, required_credits, is_active, sort_order) VALUES
('Lavagem Básica Grátis', 'Lavagem exterior completa gratuita', 500, true, 1),
('Aspiração Interior Grátis', 'Aspiração completa do interior', 300, true, 2),
('Polimento de Faróis', 'Restauro de faróis opacos', 800, true, 3),
('Hidratação de Couro', 'Tratamento completo de couro', 1000, true, 4),
('Proteção Cerâmica (50% desconto)', '50% de desconto na proteção cerâmica', 1500, true, 5),
('Lavagem Premium Grátis', 'Lavagem detalhada completa', 2000, true, 6);