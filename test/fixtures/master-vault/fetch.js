/*eslint no-console:0 */
/*
 * Downloads the Master Vault deck responses listed in manifest.json into decks/, for use as
 * deck import test fixtures. Re-run after adding a deck to the manifest:
 *
 *   node test/fixtures/master-vault/fetch.js
 */
const fs = require('fs');
const path = require('path');

const ManifestPath = path.join(__dirname, 'manifest.json');
const DeckDir = path.join(__dirname, 'decks');

// Fields that don't affect import and only bloat the fixtures
const DroppedDeckFields = [
    'flavor_text',
    'is_my_deck',
    'is_my_favorite',
    'is_on_my_watchlist',
    'notes'
];
const DroppedCardFields = ['flavor_text'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchDeck(uuid) {
    for (;;) {
        const response = await fetch(
            `https://www.keyforgegame.com/api/decks/${uuid}/?links=cards`,
            { headers: { 'User-Agent': 'keyteki-test-fixtures' } }
        );

        if (response.status === 429) {
            const body = await response.json().catch(() => ({}));
            const seconds = parseInt(String(body.detail || '').match(/\d+/)?.[0] || '10') * 2;
            console.log(`Throttled, waiting ${seconds}s`);
            await sleep(seconds * 1000);
            continue;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch ${uuid}: ${response.status}`);
        }

        return response.json();
    }
}

function trim(deckResponse) {
    for (const field of DroppedDeckFields) {
        delete deckResponse.data[field];
    }

    for (const card of deckResponse._linked.cards) {
        for (const field of DroppedCardFields) {
            delete card[field];
        }
    }

    return deckResponse;
}

async function main() {
    const manifest = JSON.parse(fs.readFileSync(ManifestPath, 'utf8'));
    fs.mkdirSync(DeckDir, { recursive: true });

    for (const entry of manifest) {
        const target = path.join(DeckDir, `${entry.uuid}.json`);
        if (fs.existsSync(target) && !process.argv.includes('--force')) {
            continue;
        }

        console.log(`Fetching ${entry.uuid} (${entry.cases.join(', ')})`);
        const deckResponse = trim(await fetchDeck(entry.uuid));
        fs.writeFileSync(target, JSON.stringify(deckResponse, null, 4) + '\n');
        await sleep(1500);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
