-- View: public."DeckStats"

-- DROP MATERIALIZED VIEW public."DeckStats";

-- Each deck's record over the last 12 months, across every player who used it. Keyed by the deck's
-- Master Vault id stored on GamePlayers, so deleting and re-importing a deck doesn't reset it.
-- A dominant win is a win by keys or concession, after 3+ turns, with the opponent on 0 keys.
-- Sealed games (random decks) and mirror matches (same deck on both sides) don't count.
-- Refreshed periodically by the lobby (REFRESH MATERIALIZED VIEW CONCURRENTLY).
-- The same definition is in migrations/25 - DeckRecords.sql; DeckRecords.spec.js checks they match.
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

-- Index: IX_DeckStats_Uuid (unique, required for a concurrent refresh)

-- DROP INDEX public."IX_DeckStats_Uuid";

CREATE UNIQUE INDEX "IX_DeckStats_Uuid"
    ON public."DeckStats" USING btree
    ("Uuid" COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
