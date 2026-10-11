-- Table: public."MasterVaultDecks"
-- The Master Vault response for each imported deck, without its cards

CREATE TABLE public."MasterVaultDecks"
(
    "Uuid" text COLLATE pg_catalog."default" NOT NULL,
    "Data" jsonb NOT NULL,
    "FetchedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_MasterVaultDecks" PRIMARY KEY ("Uuid")
)
TABLESPACE pg_default;

ALTER TABLE public."MasterVaultDecks"
    OWNER to keyteki;

-- Table: public."MasterVaultCards"
-- Cards from Master Vault deck responses, by Master Vault card id. Most are shared between decks

CREATE TABLE public."MasterVaultCards"
(
    "Id" text COLLATE pg_catalog."default" NOT NULL,
    "Card" jsonb NOT NULL,
    CONSTRAINT "PK_MasterVaultCards" PRIMARY KEY ("Id")
)
TABLESPACE pg_default;

ALTER TABLE public."MasterVaultCards"
    OWNER to keyteki;
