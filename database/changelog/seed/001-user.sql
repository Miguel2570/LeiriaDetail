-- liquibase formatted sql
-- changeset leiriadetail:seed-user
INSERT INTO users (first_name, last_name, phone, email, password_hash, is_verified, is_active, role)
VALUES ('Miguel', 'Tobias', '912881282', 'admin@leiriadetail.pt', '$2b$10$qJdq2OPzKcvNRELWg0QGseLQkz.85W9sCOlApFHQlgMtLoEtY111m',true, true, 'superadmin');