/*eslint no-console: 0*/
const path = require('path');

const ConfigService = require('../services/ConfigService');
const { getConnectionConfig } = require('./connectionConfig');

const MigrationsDir = path.join(__dirname, 'migrations');

const usage =
    'Usage: node server/db/migrate.js <up|down> [count|all] [--allow-production-down]\n' +
    '  up    applies all pending migrations, or the next <count>\n' +
    '  down  reverts the last migration, the last <count>, or all of them';

function parseCount(value, direction) {
    if (value === undefined) {
        return direction === 'up' ? Infinity : 1;
    }

    if (value === 'all') {
        return Infinity;
    }

    const count = parseInt(value, 10);
    if (Number.isNaN(count) || count < 1) {
        throw new Error(`Invalid count '${value}'`);
    }

    return count;
}

async function migrate(args) {
    const [direction, countArg] = args.filter((arg) => !arg.startsWith('--'));

    if (direction !== 'up' && direction !== 'down') {
        console.error(usage);
        process.exitCode = 1;

        return;
    }

    const configService = new ConfigService();
    const connection = getConnectionConfig(configService);

    // npm run test:db migrates before running the tests, so check here that it is the test database,
    // as config/local.json5 overrides config/test.json5
    if (process.env.NODE_ENV === 'test' && !connection.database.endsWith('_test')) {
        console.error(
            `Refusing to migrate '${connection.database}' with NODE_ENV=test, the database name must end in _test`
        );
        process.exitCode = 1;

        return;
    }

    if (
        direction === 'down' &&
        configService.isProduction() &&
        !args.includes('--allow-production-down')
    ) {
        console.error(
            'Refusing to revert migrations in production, write a new migration instead. ' +
                'Pass --allow-production-down if this really is intended.'
        );
        process.exitCode = 1;

        return;
    }

    // node-pg-migrate is ESM only
    const { runner } = await import('node-pg-migrate');

    const applied = await runner({
        databaseUrl: connection,
        dir: MigrationsDir,
        migrationsTable: 'pgmigrations',
        direction,
        count: parseCount(countArg, direction),
        checkOrder: true,
        logger: console
    });

    console.info(
        applied.length === 0
            ? 'No migrations to run'
            : `${direction === 'up' ? 'Applied' : 'Reverted'} ${applied.length} migration(s)`
    );
}

migrate(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
