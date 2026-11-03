const fs = require('fs');
const path = require('path');

const MigrationsDir = path.join(__dirname, 'migrations');

/**
 * The SQL that builds the database, in the order it runs: the baseline, then every SQL migration.
 * For checks over the schema source, such as which expansions and houses are inserted
 * @returns {{ file: string, sql: string }[]}
 */
function readSqlFiles() {
    const migrations = fs
        .readdirSync(MigrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort()
        .map((file) => path.join(MigrationsDir, file));

    return [path.join(__dirname, 'baseline.sql'), ...migrations].map((file) => ({
        file: path.relative(__dirname, file),
        sql: fs.readFileSync(file, 'utf8')
    }));
}

module.exports = { readSqlFiles };
