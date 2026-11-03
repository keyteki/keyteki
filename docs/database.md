# Database

The lobby stores everything in PostgreSQL, configured by `dbHost`, `dbPort`, `dbDatabase`, `dbUser`
and `dbPassword`.

| Path                                                                | What it is                                                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [server/db/index.js](../server/db/index.js)                         | Connection pool: `query`, `transaction(callback)` with `queryTran`, `shutdown()`                   |
| [server/db/migrate.js](../server/db/migrate.js)                     | Applies or reverts schema migrations                                                               |
| [server/db/migrations/](../server/db/migrations)                    | The migrations, applied in filename (timestamp) order                                              |
| [server/db/baseline.sql](../server/db/baseline.sql)                 | The schema from before migrations, run by the first migration                                      |
| [server/db/schema.sql](../server/db/schema.sql)                     | The schema after every migration has run, generated, for reading and review                        |
| [server/scripts/seeddevusers.js](../server/scripts/seeddevusers.js) | Adds the `admin`, `test0` and `test1` development users (password `password`), never in production |

Migrations are run by [node-pg-migrate](https://salsita.github.io/node-pg-migrate/), which records
each applied migration in the `pgmigrations` table and holds an advisory lock while it runs, so two
runs can never apply the same migration.

## Local development

`docker compose up` runs the migrations and adds the development users when the lobby container
starts. Running the lobby outside Docker (`npm run dev:lobby`), run them yourself:

```sh
NODE_APP_INSTANCE=node npm run db:migrate              # apply every pending migration
NODE_APP_INSTANCE=node npm run db:seed                 # add the development users
NODE_APP_INSTANCE=node npm run db:migrate:down         # revert the last migration (or: -- 3, -- all)
npm run db:migrate:create -- add-deck-notes            # new server/db/migrations/<timestamp>_add-deck-notes.sql
npm run db:schema:dump                                 # regenerate server/db/schema.sql from the compose database
```

## The baseline

Before migrations, fresh databases were built from `server/db/schema/*.sql` and existing ones were
changed by applying `server/db/schema/migrations/*.sql` by hand. The first migration,
[1793664000000_baseline.js](../server/db/migrations/1793664000000_baseline.js), replaces both:

-   On an empty database it runs [baseline.sql](../server/db/baseline.sql), the old schema files
    with every hand-applied migration up to `26 - UserStats`, plus the houses, expansions and roles.
-   On a database that already has the schema it changes nothing, so production and existing
    development databases just record it as applied. It first checks that hand-applied migrations 25
    and 26 are there, and fails if not; apply those from git history before the baseline, then run
    the migrations again.

Never edit `baseline.sql`: like any merged migration, change it with a new migration.

## Integration tests

Tests that need a database live under
[test/server/db-integration/](../test/server/db-integration) and run with `npm run test:db`,
not `npm test`. That applies the migrations and runs the tests against `keyteki_test`
(`config/test.json5`). Every test empties the tables except the reference data (`Expansions`,
`Houses`, `Roles`), so the tests refuse to run against a database whose name doesn't end in
`_test`.

```sh
docker compose exec postgres createdb -U keyteki keyteki_test   # once
NODE_APP_INSTANCE=node npm run test:db
```

`config/local.json5` overrides `config/test.json5`, so if it sets `dbDatabase`, put the test
database settings in `config/local-test.json5` instead.

The CI `database` job runs them on every push and pull request.

## Writing a migration

A migration is a plain SQL file with an up section and a down section. Each migration runs in its
own transaction.

```sql
-- Up Migration
ALTER TABLE public."Decks" ADD COLUMN "Notes" text;

-- Down Migration
ALTER TABLE public."Decks" DROP COLUMN "Notes";
```

The rules, most of which CI enforces:

1. **Never edit a merged migration.** Fix or change it with a new migration. CI fails a pull request
   that modifies, renames or deletes a migration (or `baseline.sql`) already on the target branch.
2. **Always write the down section.** CI applies every migration, reverts them all, and applies
   them again. Production is never rolled back, though (see 4).
3. **Keep each migration compatible with the code already running.** Migrations are applied by a
   Helm pre-upgrade hook, so the previous release keeps serving against the new schema until its
   pods are replaced. Change things in two steps: add the new column or table in one release, and
   only stop using or drop the old one in a later release.
4. **Roll production forward.** If a migration is wrong, fix it with another migration.
   `migrate.js down` refuses to run in production unless given `--allow-production-down`.
5. **Commit the regenerated `schema.sql`** with every migration. CI fails if it doesn't match.
6. **Schema and reference data only.** Data changes belong in a migration only when they're plain
   SQL over data already in Postgres, such as a new expansion row or a backfill. Anything that needs
   another system is a script under `server/scripts`.

Conventions, matching the existing schema:

-   PascalCase quoted names (`"GamePlayers"."DeckUuid"`), plural table names
-   `integer GENERATED BY DEFAULT AS IDENTITY` primary keys named `"Id"`, constraints named
    `PK_<Table>` and `FK_<Table>_<Referenced>_<Column>`, indexes `IX_<Table>_<Columns>`
-   every foreign key has an explicit `ON DELETE`

## Deployment

The lobby chart's [migrate job](../infrastructure/lobby/templates/migrate-job.yaml) runs
`node server/db/migrate.js up` as a `pre-install,pre-upgrade` hook, before the fetchdata job. If
it fails, the upgrade stops and the running release is left alone.

The job reads its config from `keyteki-migrate-secret`, which is created as a hook just before it.
It can't use `keyteki-lobby-secret`, because Helm only updates that after the pre-upgrade hooks
have run.

Keep `docker-compose.yml` and the CI `database` job on the same PostgreSQL major version as
production, so migrations are tested against what they'll run on and `schema.sql` is generated
the same way everywhere.
