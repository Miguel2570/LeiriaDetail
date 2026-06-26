-- liquibase formatted sql
-- changeset leiriadetail:001-seed-user

INSERT INTO users (
    first_name, 
    last_name, 
    phone, 
    email, 
    password_hash, 
    is_verified, 
    is_active, 
    role,
    provider,
    created_at,
    updated_at
)
SELECT * FROM (
    SELECT 
        'Leiria' AS first_name, 
        'Detail' AS last_name, 
        '912881282' AS phone, 
        'leiriadetail@gmail.com' AS email, 
        '$2b$10$8VdnNvbJaxkE5BeBn9EgtuV6e4CXmxSqTVC/YRjm/dO0I8eaUeScS' AS password_hash, -- admLeiriaDetail
        true AS is_verified, 
        true AS is_active, 
        'superadmin' AS role,
        'local' AS provider,
        CURRENT_TIMESTAMP AS created_at,
        CURRENT_TIMESTAMP AS updated_at

    UNION ALL

    SELECT 
        'Miguel', 
        'Tobias', 
        '912881282', 
        'miguelctobias@gmail.com', 
        '$2b$10$5kJCWzUN4Q4jnDapKsnYZO4XSyAhqbR2gMons.R9xnUuHJnfNdIEy', -- Veenus111!
        true, 
        true, 
        'admin',
        'local',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP

    UNION ALL

    SELECT 
        'Carlos', 
        'Pereira', 
        '918016053', 
        'carlosp952005@gmail.com', 
        '$2b$10$sA4Zs2YF8QTGp/dG/R9r7Ohv4J673RrDFY2HTBhKsVxApxLPh9YMm', -- carlos952005
        true, 
        true, 
        'admin',
        'local',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
) AS novos_utilizadores
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE users.email = novos_utilizadores.email
);