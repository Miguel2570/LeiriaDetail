-- liquibase formatted sql
-- changeset leiria:006-materials-seed
INSERT INTO materials (name, description, category, image_url, order_index) VALUES
('K2 Basic Kit', 'Bomba de pressão com espumador. Ideal para pré-lavagem com snow foam, removendo sujidade sem riscar a pintura.', 'Lavagem', 'https://allspeeddrive.com/cdn/shop/files/k2-basic-kit.jpg', 1),
('Balde Transparente Maxshine', 'Balde profissional com graduação de volume. Essencial para o método dos 2 baldes e evitar contaminação cruzada.', 'Lavagem', 'https://allspeeddrive.com/cdn/shop/files/balde-transparente.jpg', 2),
('Headlight Restorer Kit', 'Kit profissional de restauro de faróis. Remove oxidação e devolve transparência e brilho aos faróis.', 'Correção', 'https://allspeeddrive.com/cdn/shop/files/headlight-restorer.jpg', 3),
('Kit 3 Pincéis Detalhe Interior', 'Conjunto de 3 pincéis de cerdas suaves para limpeza detalhada de saídas de ar, botões e cantos interiores.', 'Interior', 'https://allspeeddrive.com/cdn/shop/files/kit-3-pinceis.jpg', 4),
('Conjunto 5 Pincéis Detalhe Exterior', 'Conjunto de 5 pincéis para detalhe exterior: jantes, grelhas, emblemas e zonas de difícil acesso.', 'Exterior', 'https://allspeeddrive.com/cdn/shop/files/kit-5-pinceis.jpg', 5),
('Aspirador Vacmaster Professional', 'Aspirador profissional de alto desempenho com filtro HEPA para limpeza profunda de interiores.', 'Equipamento', 'https://m.media-amazon.com/images/I/71kQqX4JpPL._AC_SL1500_.jpg', 6);