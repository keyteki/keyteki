
CREATE TABLE public."MasterVaultDecks"
(
    "Uuid" text COLLATE pg_catalog."default" NOT NULL,
    "Data" jsonb NOT NULL,
    "FetchedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_MasterVaultDecks" PRIMARY KEY ("Uuid")
);

ALTER TABLE public."MasterVaultDecks"
    OWNER to keyteki;

CREATE TABLE public."MasterVaultCards"
(
    "Id" text COLLATE pg_catalog."default" NOT NULL,
    "Card" jsonb NOT NULL,
    CONSTRAINT "PK_MasterVaultCards" PRIMARY KEY ("Id")
);

ALTER TABLE public."MasterVaultCards"
    OWNER to keyteki;
