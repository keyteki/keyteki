/*eslint no-console:0 */
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const db = require('../db');
const ConfigService = require('../services/ConfigService');
const WrappedService = require('../services/WrappedService');
const WrappedEmailService = require('../services/WrappedEmailService');

//
// Works out each player's annual Wrapped snapshot, and emails players to tell them it's ready
// (see docs/user-stats.md).
//
// The snapshot covers 1 January up to --to (exclusive, default today, UTC), and the page shows that range.
// Running it again replaces the snapshots but keeps when each was emailed.
//
// # Report what would be generated, and print one snapshot
// npm run wrapped -- --year 2026
//
// # Generate just your own, to check it on the page
// npm run wrapped -- --year 2026 --user admin --apply
//
// # Generate everyone's, up to and including 14 December
// npm run wrapped -- --year 2026 --to 2026-12-15 --apply
//
// # Count who would be emailed, and save one email to look at
// npm run wrapped -- --year 2026 --email --preview wrapped-email.html
//
// # Email just yourself, then everyone not emailed yet (at most 10 a second)
// npm run wrapped -- --year 2026 --email --user admin --apply
// npm run wrapped -- --year 2026 --email --apply --per-second 10
//
const optionsDefinition = [
    { name: 'year', type: Number },
    { name: 'to', type: String },
    { name: 'user', type: String },
    { name: 'email', type: Boolean, defaultValue: false },
    { name: 'preview', type: String },
    { name: 'per-second', type: Number, defaultValue: 10 },
    { name: 'apply', type: Boolean, defaultValue: false }
];

const DatePattern = /^\d{4}-\d{2}-\d{2}$/;

async function generate(options, year) {
    const today = new Date().toISOString().slice(0, 10);
    const endOfYear = `${year + 1}-01-01`;
    const to = options.to || (today < endOfYear ? today : endOfYear);

    if (!DatePattern.test(to) || to <= `${year}-01-01` || to > endOfYear) {
        throw new Error(`--to must be a date in ${year} or ${endOfYear}`);
    }

    const result = await new WrappedService().generate({
        year,
        to,
        username: options.user,
        dryRun: !options.apply,
        progress: (message) => console.info(message)
    });

    if (result.sample && !options.apply) {
        console.info(JSON.stringify(result.sample, null, 2));
    }

    console.info(
        `${options.apply ? 'Saved' : 'Would save'} ${result.saved} snapshots, ${
            result.failed
        } failed`
    );
}

async function email(options, year) {
    const result = await new WrappedEmailService(new ConfigService()).send({
        year,
        username: options.user,
        dryRun: !options.apply,
        perSecond: options['per-second'],
        progress: (message) => console.info(message)
    });

    if (options.preview && result.sample) {
        fs.writeFileSync(options.preview, result.sample.html);
        console.info(`Saved "${result.sample.subject}" to ${options.preview}`);
    }

    if (options.apply) {
        console.info(`Sent ${result.sent} emails, ${result.failed} failed`);

        if (result.unrecorded.length > 0) {
            console.error(
                'These players were emailed but could not be marked as emailed. Set "EmailedAt" for them ' +
                    `before running this again, or they will be emailed twice: ${result.unrecorded.join(
                        ', '
                    )}`
            );
            process.exitCode = 1;
        }
    } else {
        console.info(`Would email ${result.recipients} players`);
    }
}

async function main() {
    const options = commandLineArgs(optionsDefinition);
    const year = options.year || new Date().getUTCFullYear();

    await (options.email ? email(options, year) : generate(options, year));

    if (!options.apply) {
        console.info('Nothing was changed. Run again with --apply to do it.');
    }
}

main()
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => db.shutdown());
