/*eslint no-console: 0*/
// Writes server/db/schema.sql: the schema of a database built by running every migration, without
// the lines that change between pg_dump runs and versions, so the file only changes when the schema does.
//
//   node server/db/dump-schema.js           migrates a scratch database in the compose postgres and dumps it
//   pg_dump ... | node server/db/dump-schema.js --stdin    uses pg_dump output from stdin (CI)
//
// A scratch database rather than the development one, as databases from before migrations can
// differ from a migrated one in ways CI would flag, such as column order
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ScratchDatabase = 'keyteki_schema_dump';
const User = process.env.POSTGRES_USER || 'keyteki';
const Password = process.env.POSTGRES_PASSWORD || 'changemeplease';

const UnstableLines = [
    /^-- Dumped (from|by) /,
    /^\\(un)?restrict /,
    /^SET transaction_timeout = /,
    /^SET client_encoding = /
];

function writeSchema(dump) {
    const output = dump
        .replace(/\r\n/g, '\n')
        .split('\n')
        .filter((line) => !UnstableLines.some((pattern) => pattern.test(line)))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    fs.writeFileSync(path.join(__dirname, 'schema.sql'), output + '\n');
}

function inPostgres(...command) {
    return execFileSync('docker', ['compose', 'exec', '-T', 'postgres', ...command], {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024
    });
}

async function dumpScratchDatabase() {
    const { runner } = await import('node-pg-migrate');

    inPostgres('dropdb', '--if-exists', '-U', User, ScratchDatabase);
    inPostgres('createdb', '-U', User, ScratchDatabase);

    try {
        await runner({
            databaseUrl: {
                host: 'localhost',
                port: 54320,
                database: ScratchDatabase,
                user: User,
                password: Password
            },
            dir: path.join(__dirname, 'migrations'),
            migrationsTable: 'pgmigrations',
            direction: 'up',
            count: Infinity,
            checkOrder: true,
            logger: { ...console, info: () => {} }
        });

        writeSchema(
            inPostgres(
                'pg_dump',
                '-U',
                User,
                '--schema-only',
                '--no-owner',
                '--no-privileges',
                ScratchDatabase
            )
        );
    } finally {
        inPostgres('dropdb', '--if-exists', '-U', User, ScratchDatabase);
    }
}

function dumpStdin() {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (input += chunk));
    process.stdin.on('end', () => {
        if (!input.trim()) {
            console.error('No pg_dump output received on stdin');
            process.exitCode = 1;

            return;
        }

        writeSchema(input);
    });
}

if (process.argv.includes('--stdin')) {
    dumpStdin();
} else {
    dumpScratchDatabase().catch((err) => {
        console.error(err);
        process.exitCode = 1;
    });
}
