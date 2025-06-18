INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (998, 'prophecy', 'Prophecy');
ALTER TABLE "DeckCards" ADD COLUMN "ProphecyId" INTEGER;
INSERT INTO "Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (17, 886, 'PV', 'Prophetic Visions')
