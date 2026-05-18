# Adding a New Set

This guide describes the steps required to add support for a new KeyForge set to Keyteki. There are two common scenarios:

1.  **Reprint-only set** — a set that contains no mechanically new cards (e.g. a Vault Masters compilation set such as VM2025 / VM2026). Only configuration and database scaffolding is required.
2.  **Set with new cards** — a set that introduces new cards, and possibly new houses, keywords, tokens, or bonus icons (e.g. PV / DM). All of the reprint-only steps apply, plus the additional engine, card, and asset work described below.

Always model new work on the **most recent** set of the relevant type — newer sets reflect current best practices.

---

## 1. Reprint-only set (no new cards)

For a set that only reprints existing cards, you only need to register the set so that decks can be imported and selected in the lobby. The set's cards already exist in earlier sets and are looked up by name.

You will need two pieces of information up front:

-   **`ExpansionId`** — the numeric set identifier used by the Master Vault API (e.g. `939` for VM2025, `964` for VM2026).
-   **Set code and full name** — short code used in URLs/DB (e.g. `VM2026`) and the display name (e.g. `Vault Masters 2026`).

### Files to update

| File                                                                                  | Change                                                                                                                                                 |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [client/constants.js](../client/constants.js)                                         | Append a new entry to `Constants.Expansions` with `value` (string), `label`, and flags.                                                                |
| [client/Components/Games/GameFormats.jsx](../client/Components/Games/GameFormats.jsx) | Add a `{ name, label: t('Full Name') }` entry to the `expansions` array. The `name` is the lowercase short key (e.g. `vm2026`).                        |
| [client/Components/Games/NewGame.jsx](../client/Components/Games/NewGame.jsx)         | Add the new key to the `expansions` object passed to `lobbySendMessage` and add a `!formProps.values.<key> &&` clause in the sealed-format validation. |
| [server/services/DeckService.js](../server/services/DeckService.js)                   | Add an `if (expansions.<key>) { dbExpansions.push(<ExpansionId>); }` block in the sealed-deck random-pick logic.                                       |
| [server/db/schema/99 - Data.sql](../server/db/schema/99%20-%20Data.sql)               | Add a new `INSERT INTO public."Expansions"` row with the next sequential `Id`, and bump the `setval` for `Expansions_Id_seq` to match.                 |
| [server/db/schema/migrations/](../server/db/schema/migrations)                        | Create a new migration file `NN - <CODE>.sql` (next sequential number) containing the same `INSERT INTO "Expansions"` row.                             |

> [server/constants.js](../server/constants.js) only needs an entry if the new set requires `tideRequired`, `tokenRequired`, or `prophecySupported`. Reprint-only sets with all-false flags can be omitted — the lookup falls back to undefined and treats them as no special requirements (this is the pattern used by VM2023 and VM2024).

### Other notes

-   **Set icon images** — drop two PNGs keyed by `ExpansionId` into `client/assets/img/`:
    -   `client/assets/img/idbacks/<ExpansionId>.png` — small set icon (used on card backs and in compact lists)
    -   `client/assets/img/<ExpansionId>.png` — larger deck icon (used in the lobby and deck lists)

    Both are wired up automatically by the loop in [client/constants.js](../client/constants.js) that populates `SetIconPaths` and `DeckIconPaths`. Use an existing set as a size/style reference (e.g. `939.png` for VM2025).

-   **Locales** — set names use `t('Full Name')` so English is the natural fallback; new locale entries are only needed if a translator provides them.
-   **`keyteki-json-data`** — the submodule must contain a pack file (e.g. `packs/VM25.json`, matching upstream MV naming) before `npm run fetchdata` can import cards. The submodule is maintained separately; if the pack file doesn't yet exist upstream the rest of the scaffolding can still ship.
-   **No card or test files are required** for a reprint-only set — existing card implementations are reused based on card name.

### Verification

After making the changes:

-   `npm run lint`
-   `npm test`
-   For a full local DB import: apply the migration (see below) and then re-run `npm run fetchdata -- --no-images`.

### Applying the migration locally

There is no automated migration runner in this repo. The SQL files under `server/db/schema/` are auto-applied by the Postgres Docker image only on a **fresh data volume** (via `/docker-entrypoint-initdb.d`); the `migrations/` directory is a record of incremental changes that operators apply by hand.

For local testing, either start from a clean DB or apply the new migration to your existing one.

**Option A — fresh DB (simplest)**

Wipes the Postgres volume and re-initializes from `server/db/schema/*.sql`, which now includes the new row in `99 - Data.sql`:

```sh
sudo docker compose down -v        # removes the postgres volume
sudo docker compose up -d redis postgres
NODE_APP_INSTANCE=node npm run fetchdata -- --no-images
```

**Option B — apply the migration to an existing DB**

Run the new migration file against the running Postgres (port `54320` per `config/default-node.json5`):

```sh
psql -h localhost -p 54320 -U keyteki -d keyteki \
    -f "server/db/schema/migrations/NN - <CODE>.sql"
```

Or via the container:

```sh
sudo docker compose exec -T postgres \
    psql -U keyteki -d keyteki \
    < "server/db/schema/migrations/NN - <CODE>.sql"
```

Then bump the sequence so future inserts don't collide with the new row's `Id`:

```sh
psql -h localhost -p 54320 -U keyteki -d keyteki \
    -c 'SELECT setval(''public."Expansions_Id_seq"'', <Id>, true);'
```

---

## 2. Set with new cards

A set with new cards builds on the reprint-only checklist above and adds card data, card implementations, tests, and any required engine/asset work.

### Card data and implementations

-   Update the `keyteki-json-data` submodule so that the new pack file (e.g. `packs/<CODE>.json`) exists with `ids`, `code`, `name`, `cardCount`, and `cards`.
-   Create a new card directory under [server/game/cards/](../server/game/cards) named `<N>-<CODE>/` (where `<N>` is the next sequential prefix). One `.js` file per implemented card. Follow the conventions in [implementing-cards.md](implementing-cards.md) and use the most recent set as your style reference.
-   Create a parallel test directory under [test/server/cards/](../test/server/cards) named `<N>-<CODE>/`. One `.spec.js` per card following [testing-cards.md](testing-cards.md) and [card-messages.md](card-messages.md).

### Engine extensions (only if introduced by the set)

The DM PR ([#5003](https://github.com/keyteki/keyteki/pull/5003)) is the canonical example of a content-heavy set. Look at it for working patterns when the set introduces any of the following:

-   **New house** — update `Constants.Houses` and `Constants.HousesNames` in `server/constants.js`, add icons/backgrounds (`client/assets/img/`), tailwind/CSS entries, and wire the house through `client/constants.js` icon paths.
-   **New token type** (e.g. Corrosion) — add to `CardImage`, `archonMaker.js`, `GameActions`, tokens images, and any rules-engine effects that interact with it.
-   **New bonus icon** (e.g. Power) — extend `EnhancementPips` in `client/constants.js`, add the enhancement image, and update the card-enhancement parsing/runtime in `server/game/cards/CardEnhancements.js`.
-   **New keywords or mechanics** — implement in `server/game/keywords/` or the appropriate game step, and document under [keywords.md](keywords.md).
-   **Engine rule changes** (e.g. Hazardous ignoring, Invulnerability, AllocateCaptureAction) — implement in the corresponding game-step or game-action files and add focused tests.

### Anomaly handling (only if the set introduces or reprints anomalies)

Anomaly cards belong to a different house than their printed expansion. Update the `anomalyOverrides` map in [server/services/DeckService.js](../server/services/DeckService.js) so each anomaly card lists every set it can appear in (`anomalySets: [...]`).

### Verification

-   `npm run lint`
-   `npm test` — run focused suites first (`npx vitest test/server/cards/<N>-<CODE>`), then the full suite.
-   Manually smoke-test the lobby filter and sealed-deck generation for the new set.
