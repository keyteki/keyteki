-- Table: public."DeckHouses"

-- DROP TABLE public."DeckHouses";

CREATE TABLE public."DeckHouses"
(
    "DeckId" integer NOT NULL,
    "HouseId" integer NOT NULL,
    "ImageUrl" TEXT NULL,
    "Enhancements" TEXT NULL,
    CONSTRAINT "PK_DeckHouses" PRIMARY KEY ("DeckId", "HouseId"),
    CONSTRAINT "FK_DeckHouses_Decks_DeckId" FOREIGN KEY ("DeckId")
        REFERENCES public."Decks" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_DeckHouses_Houses_HouseId" FOREIGN KEY ("HouseId")
        REFERENCES public."Houses" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public."DeckHouses"
    OWNER to keyteki;
-- Index: IX_DeckHouses_HouseId

-- DROP INDEX public."IX_DeckHouses_HouseId";

CREATE INDEX "IX_DeckHouses_HouseId"
    ON public."DeckHouses" USING btree
    ("HouseId" ASC NULLS LAST)
    TABLESPACE pg_default;