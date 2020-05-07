-- Table: public."ChallongeSettings"

-- DROP TABLE public."ChallongeSettings";

CREATE TABLE public."ChallongeSettings"
(
    "Id" integer NOT NULL,
    "ApiKey" text COLLATE pg_catalog."default",
    "SubDomain" text COLLATE pg_catalog."default",
    "UserId" integer NOT NULL,
    CONSTRAINT "PK_ChallongeSettings" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ChallongeSettings_Users_UserId" FOREIGN KEY ("UserId")
        REFERENCES public."Users" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
)

    TABLESPACE pg_default;

ALTER TABLE public."ChallongeSettings"
    OWNER to keyteki;
