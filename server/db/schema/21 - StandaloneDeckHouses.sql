-- Table: public."StandaloneDeckHouses"

-- DROP TABLE public."StandaloneDeckHouses";

CREATE TABLE public."StandaloneDeckHouses"
(
    "DeckId" integer NOT NULL,
    "HouseId" integer NOT NULL,
    CONSTRAINT "PK_StandaloneDeckHouses" PRIMARY KEY ("DeckId", "HouseId"),
    CONSTRAINT "FK_StandaloneDeckHouses_Houses_HouseId" FOREIGN KEY ("HouseId")
        REFERENCES public."Houses" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_StandaloneDeckHouses_StandaloneDecks_DeckId" FOREIGN KEY ("DeckId")
        REFERENCES public."StandaloneDecks" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."StandaloneDeckHouses"
    OWNER to keyteki;
-- Index: IX_StandaloneDeckHouses_HouseId

-- DROP INDEX public."IX_StandaloneDeckHouses_HouseId";

CREATE INDEX "IX_StandaloneDeckHouses_HouseId"
    ON public."StandaloneDeckHouses" USING btree
    ("HouseId" ASC NULLS LAST)
    TABLESPACE pg_default;