-- Table: public."UserWrapped"

-- DROP TABLE public."UserWrapped";

-- Each player's annual Wrapped snapshot, saved by server/scripts/wrapped.js (see WrappedService).
-- "EmailedAt" is set when the Wrapped email is sent, and kept when the snapshot is generated again.
CREATE TABLE public."UserWrapped"
(
    "UserId" integer NOT NULL,
    "Year" integer NOT NULL,
    "Version" integer NOT NULL,
    "Data" jsonb NOT NULL,
    "GeneratedAt" timestamp without time zone NOT NULL,
    "EmailedAt" timestamp without time zone,
    CONSTRAINT "PK_UserWrapped" PRIMARY KEY ("UserId", "Year"),
    CONSTRAINT "FK_UserWrapped_Users_UserId" FOREIGN KEY ("UserId")
        REFERENCES public."Users" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."UserWrapped"
    OWNER to keyteki;
