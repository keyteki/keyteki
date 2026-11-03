# Deck Records

Each deck shows its record on Keyteki across every player who has used it, so players can judge how strong a deck plays in practice without relying on external ratings.

## What is counted

-   **Window:** games started in the last 12 months.
-   **Games:** finished games with a winner. Every such game counts, however short, so conceding early doesn't protect a deck's record. A game abandoned by a rematch request has no winner, so it doesn't count.
-   **Wins / losses:** from the deck's side of each game.
-   **Dominant wins:** wins by keys or concession, where the winner took 3+ turns and the opponent forged no keys. The 3-turn minimum stops an opponent leaving immediately from counting as a dominant win. The client shows them as a count, and as a percentage of all games, not of wins.
-   **Excluded decks:** alliance and standalone decks, which aren't single Master Vault decks.
-   **Excluded games:** sealed games, where the deck is drawn at random from other players' decks, and mirror matches, where both players used the same deck and one game would count as both a win and a loss.

The client shows the plain record (`4–1`) for any deck, and the win/loss bar and percentages once a deck has 5 or more games.

## Why records survive re-importing a deck

Deleting a deck removes its `Decks` row, and `GamePlayers."DeckId"` is set to null when that happens. Records are therefore keyed on `GamePlayers."DeckUuid"`, the Master Vault id of the deck played, which is written when a game is saved (`Game.getSaveState()` → `GameService.update()`). Deleting and re-importing a deck, or importing it on another account, doesn't reset its record.

For reversal, swap and adaptive games, the id comes from the deck each player actually played (`player.deckData.uuid`), not the deck they selected.

## Where it lives

| Piece                                                                              | Location                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GamePlayers."DeckUuid"` column + index                                            | [15 - GamePlayers.sql](../server/db/schema/15%20-%20GamePlayers.sql)                                                                                                                                                                                  |
| `DeckStats` materialized view                                                      | [25 - DeckStats.sql](../server/db/schema/25%20-%20DeckStats.sql)                                                                                                                                                                                      |
| Migration for existing databases (adds the column, backfills it, creates the view) | [migrations/25 - DeckRecords.sql](../server/db/schema/migrations/25%20-%20DeckRecords.sql)                                                                                                                                                            |
| `Games."StartedAt"` index, so the refresh only reads the last 12 months            | [14 - Games.sql](../server/db/schema/14%20-%20Games.sql)                                                                                                                                                                                              |
| Refresh at startup and hourly                                                      | `Lobby.init()` and the `Lobby` constructor → `DeckService.refreshDeckStats()`                                                                                                                                                                         |
| Lookup                                                                             | `DeckService.getById()` and `findForUser()` join `DeckStats`; `mapDeck()` returns it as `deck.record`                                                                                                                                                 |
| Display                                                                            | [DeckRecord.jsx](../client/Components/Decks/DeckRecord.jsx), used by the deck page ([DeckSummary.jsx](../client/Components/Decks/DeckSummary.jsx)) and the pending game ([PendingGamePlayers.jsx](../client/Components/Games/PendingGamePlayers.jsx)) |
| Pending game                                                                       | `Lobby.onSelectDeck()` loads the deck with `getById()`; `PendingGame.getSummary()` sends `deck.record` to both players                                                                                                                                |

`DeckStats` is refreshed with `REFRESH MATERIALIZED VIEW CONCURRENTLY`, which needs the unique index on `"Uuid"` and must run as the view's owner (`keyteki`). Records are up to an hour behind.

The view is defined in both the schema file (fresh databases) and the migration (existing ones). [DeckRecords.spec.js](../test/server/DeckRecords.spec.js) fails if the two definitions differ, so change both together.

In reversal, swap and adaptive games the pending game shows the record of the deck each player selected, next to that deck. The game itself is recorded against the deck each player actually played.

## Applying to an existing database

Apply the migration by hand, as described in [Adding a New Set](new-sets.md#applying-the-migration-locally):

```sh
psql -h localhost -p 54320 -U keyteki -d keyteki \
    -f "server/db/schema/migrations/25 - DeckRecords.sql"
```

Games whose deck was deleted before the migration can't be backfilled and don't count towards any record.
