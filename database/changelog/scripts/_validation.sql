-- scripts/_validation.sql
-- Verificar utilizadores
SELECT COUNT(*) as total_users FROM users;

-- Verificar serviços
SELECT COUNT(*) as total_services FROM services;

-- Verificar veículos
SELECT COUNT(*) as total_vehicles FROM user_vehicles;