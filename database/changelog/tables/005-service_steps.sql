-- liquibase formatted sql
-- changeset leiria:005-service_steps

CREATE TABLE service_steps (
  id SERIAL PRIMARY KEY,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 0,
  UNIQUE(service_id, step_order)
);