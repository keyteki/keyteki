INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (1, 'untamed', 'Untamed');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (2, 'staralliance', 'Star Alliance');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (3, 'shadows', 'Shadows');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (4, 'saurian', 'Saurian');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (5, 'sanctum', 'Sanctum');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (6, 'mars', 'Mars');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (7, 'logos', 'Logos');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (8, 'dis', 'Dis');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (9, 'brobnar', 'Brobnar');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (10, 'unfathomable', 'Unfathomable');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (11, 'ekwidon', 'Ekwidon');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (12, 'geistoid', 'Geistoid');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (13, 'skyborn', 'Skyborn');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (14, 'redemption', 'Redemption');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (15, 'keyraken', 'Keyraken');
-- Leave these last
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (997, 'archonpower', 'Archon Power');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (998, 'prophecy', 'Prophecy');
INSERT INTO public."Houses" ("Id", "Code", "Name") VALUES (999, 'thetide', 'The Tide');

--
-- Name: Houses_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyteki
--

SELECT pg_catalog.setval('public."Houses_Id_seq"', 9, true);

INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (1, 453, 'WC', 'Worlds Collide (Anomoly)');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (2, 452, 'WC', 'Worlds Collide');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (3, 435, 'AoA', 'Age of Ascension');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (4, 341, 'CotA', 'Call of the Archons');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (5, 479, 'MM', 'Mass Mutation');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (6, 496, 'DT', 'Dark Tidings');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (7, 600, 'WoE', 'Winds of Exchange');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (8, 601, 'UC2022', 'Unchained 2022');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (9, 609, 'VM2023', 'Vault Masters 2023');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (10, 700, 'GR', 'Grim Reminders');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (11, 737, 'VM2024', 'Vault Masters 2024');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (12, 800, 'AS', 'Æmber Skies');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (13, 855, 'ToC', 'Tokens of Change');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (14, 874, 'MoMu', 'More Mutation');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (15, 907, 'DISC', 'Discovery');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (16, 939, 'VM2025', 'Vault Masters 2025');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (17, 886, 'PV', 'Prophetic Visions');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (18, 918, 'CC', 'Crucible Clash');
INSERT INTO public."Expansions" ("Id", "ExpansionId", "Code", "Name") VALUES (19, 722, 'MG', 'Menagerie');

--
-- Name: Expansions_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyteki
--

SELECT pg_catalog.setval('public."Expansions_Id_seq"', 4, true);

INSERT INTO public."Roles" ("Id", "Name") VALUES (1, 'UserManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (2, 'BanListManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (3, 'NewsManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (4, 'GameManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (5, 'MotdManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (6, 'PermissionsManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (7, 'NodeManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (8, 'ChatManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (9, 'DeckVerifier');
INSERT INTO public."Roles" ("Id", "Name") VALUES (10, 'Admin');
INSERT INTO public."Roles" ("Id", "Name") VALUES (11, 'Supporter');
INSERT INTO public."Roles" ("Id", "Name") VALUES (12, 'Contributor');
INSERT INTO public."Roles" ("Id", "Name") VALUES (13, 'TournamentManager');
INSERT INTO public."Roles" ("Id", "Name") VALUES (14, 'TournamentWinner');
INSERT INTO public."Roles" ("Id", "Name") VALUES (15, 'PreviousTournamentWinner');
INSERT INTO public."Roles" ("Id", "Name") VALUES (16, 'KeepSupporterStatus');

--
-- Name: Roles_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: keyteki
--

SELECT pg_catalog.setval('public."Roles_Id_seq"', 12, true);

-- Add default admin user (NOT FOR PRODUCTION)

INSERT INTO public."Users" ("Id", "Password", "Registered", "Username", "Email", "Settings_Background", "Settings_CardSize",
    "Settings_OrderAbilities", "Settings_ConfirmOneClick", "Settings_UseHalfSizedCards", "Verified", "Disabled", "RegisterIp") VALUES
    (1, '$2b$10$T7eqHoi26C3ADmTDbGOYseTbsrPdCoNFkMKmgh21T4Y6i9NVylgxG', NOW(), 'admin', 'admin@example.com', 'Brobnar', 'normal', False, True, False, True,
     False, '127.0.0.1');

-- Add default test users (NOT FOR PRODUCTION)

INSERT INTO public."Users" ("Id", "Password", "Registered", "Username", "Email", "Settings_Background", "Settings_CardSize",
    "Settings_OrderAbilities", "Settings_ConfirmOneClick", "Settings_UseHalfSizedCards", "Verified", "Disabled", "RegisterIp") VALUES
    (2, '$2b$10$T7eqHoi26C3ADmTDbGOYseTbsrPdCoNFkMKmgh21T4Y6i9NVylgxG', NOW(), 'test0', 'test0@example.com', 'none', 'normal', True, True, False, True,
     False, '127.0.0.1');
INSERT INTO public."Users" ("Id", "Password", "Registered", "Username", "Email", "Settings_Background", "Settings_CardSize",
    "Settings_OrderAbilities", "Settings_ConfirmOneClick", "Settings_UseHalfSizedCards", "Verified", "Disabled", "RegisterIp") VALUES
    (3, '$2b$10$T7eqHoi26C3ADmTDbGOYseTbsrPdCoNFkMKmgh21T4Y6i9NVylgxG', NOW(), 'test1', 'test1@example.com', 'Dis', 'normal', True, True, False, True,
     False, '127.0.0.1');

SELECT pg_catalog.setval('public."Users_Id_seq"', 11, true);

INSERT INTO public."UserRoles" ("UserId", "RoleId") VALUES (1, 1);
INSERT INTO public."UserRoles" ("UserId", "RoleId") VALUES (1, 6);
INSERT INTO public."UserRoles" ("UserId", "RoleId") VALUES (1, 10);

ALTER TABLE "DeckCards" ADD COLUMN "ProphecyId" INTEGER;
