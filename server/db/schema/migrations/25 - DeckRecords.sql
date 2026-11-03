-- Deck records: store the Master Vault id of the deck each player used, so a deck's record survives
-- the deck being deleted and re-imported, then build per-deck stats from it.

ALTER TABLE public."GamePlayers" ADD COLUMN "DeckUuid" text COLLATE pg_catalog."default";

-- Backfill from games whose deck still exists (alliance decks are not single Master Vault decks)
UPDATE public."GamePlayers" gp
SET "DeckUuid" = d."Uuid"
FROM public."Decks" d
WHERE d."Id" = gp."DeckId"
  AND NOT d."IsAlliance"
  AND gp."DeckUuid" IS NULL;

CREATE INDEX "IX_GamePlayers_DeckUuid"
    ON public."GamePlayers" USING btree
    ("DeckUuid" COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Lets the DeckStats refresh read only the last 12 months of games
CREATE INDEX "IX_Games_StartedAt"
    ON public."Games" USING btree
    ("StartedAt" ASC NULLS LAST)
    TABLESPACE pg_default;

-- Same definition as schema/25 - DeckStats.sql; DeckRecords.spec.js checks they match.
CREATE MATERIALIZED VIEW public."DeckStats" AS
SELECT gp."DeckUuid" AS "Uuid",
       count(*) AS "Games",
       count(*) FILTER (WHERE gp."PlayerId" = g."WinnerId") AS "Wins",
       count(*) FILTER (
           WHERE gp."PlayerId" = g."WinnerId"
             AND g."WinReason" IN ('keys', 'concede')
             AND COALESCE(gp."Turn", 0) >= 3
             AND COALESCE(opp."Keys", 0) = 0
       ) AS "DominantWins"
FROM public."GamePlayers" gp
JOIN public."Games" g ON g."Id" = gp."GameId"
LEFT JOIN public."GamePlayers" opp ON opp."GameId" = gp."GameId" AND opp."PlayerId" <> gp."PlayerId"
WHERE gp."DeckUuid" IS NOT NULL
  AND opp."DeckUuid" IS DISTINCT FROM gp."DeckUuid"
  AND g."WinnerId" IS NOT NULL
  AND g."FinishedAt" IS NOT NULL
  AND g."GameFormat" IS DISTINCT FROM 'sealed'
  AND g."StartedAt" >= now() - interval '12 months'
GROUP BY gp."DeckUuid";

ALTER MATERIALIZED VIEW public."DeckStats"
    OWNER TO keyteki;

CREATE UNIQUE INDEX "IX_DeckStats_Uuid"
    ON public."DeckStats" USING btree
    ("Uuid" COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
