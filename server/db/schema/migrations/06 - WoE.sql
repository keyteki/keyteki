INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (11, 'ekwidon', 'Ekwidon');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (7, 600, 'WoE', 'Winds of Exchange');
ALTER TABLE "DeckCards" ADD COLUMN "IsNonDeck" boolean NOT NULL DEFAULT false;
