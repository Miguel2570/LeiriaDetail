-- liquibase formatted sql
-- changeset leiria:000-create-file

CREATE TABLE IF NOT EXISTS File (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    FileName VARCHAR(255) NOT NULL,
    FileExtension VARCHAR(255) NOT NULL,
    FileSize BIGINT NOT NULL,
    FileData BYTEA NOT NULL,
    RelatedEntityType VARCHAR(100),
    RelatedEntityId INTEGER,
    Tags TEXT[],
    createdate TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createuser UUID,
    changedate TIMESTAMP WITH TIME ZONE,
    changeuser UUID
);