const fs = require('fs');
const path = require('path');

const { Expansions, compareByRelease } = require('../../master-vault-data/src/expansions');

const RootPath = path.join(__dirname, '../..');

/**
 * Builds the card map that CardService.getAllCards returns after fetchdata has imported the
 * pack files: keyed by card id, with the most recently released printing winning when a card
 * has been printed more than once.
 * Unsupported expansions are skipped, as fetchdata does.
 */
function buildCardMapFromPacks() {
    const expansionIds = new Set(
        Expansions.filter((expansion) => expansion.supported).map((expansion) => expansion.id)
    );
    const packDir = path.join(RootPath, 'master-vault-data/packs');
    const printings = [];
    const seen = new Set();

    for (const file of fs.readdirSync(packDir)) {
        const pack = JSON.parse(fs.readFileSync(path.join(packDir, file), 'utf8'));
        for (const card of pack.cards) {
            const key = `${card.id}|${card.expansion}`;
            if (!expansionIds.has(card.expansion) || seen.has(key)) {
                continue;
            }

            seen.add(key);
            printings.push({ ...card, packCode: pack.code });
        }
    }

    printings.sort((a, b) => compareByRelease(a.expansion, b.expansion));

    const cards = {};
    for (const card of printings) {
        cards[card.id] = card;
    }

    return cards;
}

module.exports = { buildCardMapFromPacks };
