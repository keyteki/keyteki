-- Up Migration
-- From the 2020 schema files, never read or written, and never added to production by hand
ALTER TABLE public."DeckHouses" DROP COLUMN "ImageUrl", DROP COLUMN "Enhancements";

-- Down Migration
ALTER TABLE public."DeckHouses" ADD COLUMN "ImageUrl" TEXT NULL, ADD COLUMN "Enhancements" TEXT NULL;
