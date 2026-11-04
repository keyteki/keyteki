const fs = require('fs');
const path = require('path');

const BaselineSql = fs.readFileSync(path.join(__dirname, '../baseline.sql'), 'utf8');

/**
 * The tables, columns, indexes and views baseline.sql creates, read from its CREATE statements
 */
function parseBaseline() {
    const tables = new Map();
    for (const match of BaselineSql.matchAll(/^CREATE TABLE public\."(\w+)"\s*\(([\s\S]*?)^\)/gm)) {
        const columns = [...match[2].matchAll(/^\s+"(\w+)"\s/gm)].map((column) => column[1]);
        tables.set(match[1], columns);
    }

    for (const match of BaselineSql.matchAll(/^ALTER TABLE public\."(\w+)" ADD COLUMN "(\w+)"/gm)) {
        tables.get(match[1]).push(match[2]);
    }

    return {
        tables,
        indexes: [...BaselineSql.matchAll(/^CREATE (?:UNIQUE )?INDEX "?(\w+)"?/gm)].map(
            (match) => match[1]
        ),
        views: [...BaselineSql.matchAll(/^CREATE MATERIALIZED VIEW public\."(\w+)"/gm)].map(
            (match) => match[1]
        )
    };
}

/**
 * What baseline.sql creates that the database doesn't have
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
async function findMissing(pgm) {
    const { tables, indexes, views } = parseBaseline();
    const columns = new Set(
        (
            await pgm.db.select(
                `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'`
            )
        ).map((row) => `${row.table_name}.${row.column_name}`)
    );
    const existingIndexes = new Set(
        (await pgm.db.select(`SELECT indexname FROM pg_indexes WHERE schemaname = 'public'`)).map(
            (row) => row.indexname
        )
    );
    const existingViews = new Set(
        (
            await pgm.db.select(`SELECT matviewname FROM pg_matviews WHERE schemaname = 'public'`)
        ).map((row) => row.matviewname)
    );

    return [
        ...[...tables].flatMap(([table, tableColumns]) =>
            tableColumns.map((column) => `${table}.${column}`).filter((key) => !columns.has(key))
        ),
        ...indexes.filter((index) => !existingIndexes.has(index)),
        ...views.filter((view) => !existingViews.has(view))
    ];
}

/**
 * Creates the schema on an empty database. Databases created before migrations already have it,
 * from server/db/schema and the hand applied migrations, so this only records it as applied.
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = async (pgm) => {
    const [{ empty }] = await pgm.db.select(
        `SELECT to_regclass('public."Users"') IS NULL AS "empty"`
    );

    if (empty) {
        pgm.sql(BaselineSql);

        return;
    }

    const missing = await findMissing(pgm);
    if (missing.length > 0) {
        throw new Error(
            'This database predates migrations but is missing parts of the schema, from hand applied ' +
                'migrations in server/db/schema/migrations (in git history before the baseline). Apply ' +
                `them first. Missing: ${missing.join(', ')}`
        );
    }
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
    const { tables, views } = parseBaseline();

    for (const view of views) {
        pgm.sql(`DROP MATERIALIZED VIEW IF EXISTS public."${view}"`);
    }

    for (const table of [...tables.keys()].reverse()) {
        pgm.sql(`DROP TABLE IF EXISTS public."${table}" CASCADE`);
    }
};
