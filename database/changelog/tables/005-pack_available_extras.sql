-- liquibase formatted sql
-- changeset leiria:005-pack_available_extras

CREATE TABLE pack_available_extras (
  id SERIAL PRIMARY KEY,
  pack_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  extra_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0,
  UNIQUE(pack_id, extra_id)
);