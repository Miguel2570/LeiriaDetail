-- liquibase formatted sql
-- changeset leiriadetail:001-seed-user
INSERT INTO users (first_name, last_name, phone, email, password_hash, is_verified, is_active, role)
SELECT 'Miguel', 'Tobias', '912881282', 'admin@leiriadetail.pt', '$2b$10$qJdq2OPzKcvNRELWg0QGseLQkz.85W9sCOlApFHQlgMtLoEtY111m', true, true, 'superadmin'
WHERE NOT EXISTS (SELECT 5 FROM users WHERE email = 'admin@leiriadetail.pt');