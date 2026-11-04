const db = require('../../../../server/db');
const ConfigService = require('../../../../server/services/ConfigService');

const database = new ConfigService().getValue('dbDatabase');

if (!database || !database.endsWith('_test')) {
    throw new Error(
        `Refusing to run database integration tests against '${database}', the database name must end in _test`
    );
}

// Tables the baseline migration fills with reference data, which tests rely on being there
const ReferenceTables = ['Expansions', 'Houses', 'Roles'];

async function resetDatabase() {
    const tables = await db.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> ALL($1)`,
        [['pgmigrations', ...ReferenceTables]]
    );

    if (tables.length > 0) {
        await db.query(
            `TRUNCATE ${tables
                .map((table) => `"${table.tablename}"`)
                .join(', ')} RESTART IDENTITY CASCADE`
        );
    }

    // Materialized, so it keeps the previous test's rows until refreshed
    await db.query('REFRESH MATERIALIZED VIEW "DeckStats"');
}

afterAll(async function () {
    await db.shutdown();
});

module.exports = { db, resetDatabase };
