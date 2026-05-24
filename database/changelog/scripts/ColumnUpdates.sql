-- scripts/ColumnUpdates.sql
-- Exemplo: Adicionar coluna phone à tabela users se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);