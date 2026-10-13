INSERT INTO "Expansions" ("Id", "ExpansionId", "Code", "Name")
SELECT 21, 722, 'MG2024', 'Menagerie 2024'
WHERE NOT EXISTS (SELECT 1 FROM "Expansions" WHERE "ExpansionId" = 722);
