ALTER TABLE "DeckCards" ADD COLUMN "ImageUrl" TEXT NULL;
ALTER TABLE "DeckCards" ADD COLUMN "HouseId" integer NULL;
ALTER TABLE "DeckCards" ADD COLUMN "Enhancements" TEXT NULL;

ALTER TABLE "DeckCards" ADD CONSTRAINT "FK_DeckCards_Houses_HouseId" FOREIGN KEY ("HouseId")
        REFERENCES public."Houses" ("Id") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE;