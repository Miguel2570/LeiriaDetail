-- liquibase formatted sql
-- changeset leiria:reviews-seed
INSERT INTO reviews (name, car, text, rating) VALUES
('João Francisco', 'Tesla Model 3', 'Entreguei o meu carro cheio de marcas de lavagens antigas e recebi-o com um brilho de espelho. O Pack Completo vale cada cêntimo. Trabalho de excelência em Leiria!', 5),
('Marta Silva', 'BMW Série 1', 'Os estofos estavam manchados e os plásticos baços. Parecia magia, o detalhe interior deixou o carro a cheirar a novo. O cuidado e a simpatia foram incríveis.', 5),
('Carlos Mendes', 'Porsche Macan', 'Como dono de um carro premium, tenho muito receio onde o deixo. O profissionalismo e os produtos usados (CarPro) deixaram-me totalmente descansado. Recomendo a 100%.', 5),
('Ricardo Pereira', 'Audi A4', 'Serviço de detalhe impecável. A atenção aos pormenores é de outro nível. O carro ficou melhor do que quando saiu do stand.', 5);