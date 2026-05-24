-- liquibase formatted sql
-- changeset leiria:seed-users
INSERT INTO users (id, name, email, password) VALUES 
(1, 'Cliente Teste', 'teste@leiriadetail.pt', 'password123');