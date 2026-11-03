const fs = require('fs');
const path = require('path');

// Every table in baseline.sql, dropped in reverse so foreign keys never block a drop
const Tables = [
    'Expansions',
    'Houses',
    'Users',
    'Roles',
    'UserRoles',
    'RefreshToken',
    'Cards',
    'CardLocaleNames',
    'BlockList',
    'BanList',
    'Decks',
    'DeckCards',
    'DeckHouses',
    'Games',
    'GamePlayers',
    'Messages',
    'Motd',
    'News',
    'StandaloneDecks',
    'StandaloneDeckCards',
    'StandaloneDeckHouses',
    'ChallongeSettings',
    'DeckAccolades',
    'MasterVaultDecks',
    'MasterVaultCards',
    'UserMonthlyStats',
    'UserWrapped'
];

async function exists(pgm, sql) {
    const [row] = await pgm.db.select(`SELECT ${sql} AS "exists"`);

    return row.exists;
}

/**
 * Creates the schema on an empty database. Databases created before migrations already have it,
 * from server/db/schema and the hand applied migrations, so this only records it as applied.
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = async (pgm) => {
    if (!(await exists(pgm, `to_regclass('public."Users"') IS NOT NULL`))) {
        pgm.sql(fs.readFileSync(path.join(__dirname, '../baseline.sql'), 'utf8'));

        return;
    }

    // What the last hand applied migrations (25 - DeckRecords and 26 - UserStats) added
    const column = (table, name) =>
        `EXISTS (SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = '${table}' AND column_name = '${name}')`;
    const checks = [
        column('GamePlayers', 'DeckUuid'),
        `to_regclass('public."DeckStats"') IS NOT NULL`,
        `to_regclass('public."UserMonthlyStats"') IS NOT NULL`,
        `to_regclass('public."UserWrapped"') IS NOT NULL`,
        column('Users', 'Settings_EmailUpdates')
    ];

    for (const check of checks) {
        if (!(await exists(pgm, check))) {
            throw new Error(
                'This database predates migrations but is missing hand applied migrations (failed: ' +
                    check.replace(/\s+/g, ' ') +
                    '). Apply the files from server/db/schema/migrations, in git history before ' +
                    'the baseline, first.'
            );
        }
    }
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
    pgm.sql('DROP MATERIALIZED VIEW IF EXISTS public."DeckStats"');
    for (const table of [...Tables].reverse()) {
        pgm.sql(`DROP TABLE IF EXISTS public."${table}" CASCADE`);
    }
};
