const fs = require('fs');
const path = require('path');

const RootPath = path.join(__dirname, '../..');

/**
 * Expansion ids registered in the database seed data. fetchdata skips cards from any other
 * expansion, so the card map built here does too.
 */
function getSeededExpansionIds() {
    const sql = fs.readFileSync(path.join(RootPath, 'server/db/schema/99 - Data.sql'), 'utf8');
    const ids = new Set();
    for (const match of sql.matchAll(/INSERT INTO public\."Expansions".*VALUES \(\d+, (\d+),/g)) {
        ids.add(parseInt(match[1]));
    }

    return ids;
}

/**
 * Builds the card map that CardService.getAllCards returns after fetchdata has imported the
 * pack files: keyed by card id, with the highest expansion id winning when a card has been
 * printed more than once.
 */
function buildCardMapFromPacks() {
    const expansionIds = getSeededExpansionIds();
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

    printings.sort((a, b) => a.expansion - b.expansion);

    const cards = {};
    for (const card of printings) {
        cards[card.id] = card;
    }

    return cards;
}

module.exports = { buildCardMapFromPacks };
