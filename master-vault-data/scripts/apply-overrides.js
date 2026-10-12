// Applies overrides.json to every pack file, e.g. after adding a new override.
// Usage: node scripts/apply-overrides.js
const fs = require('fs');
const path = require('path');

const { applyOverrides } = require('../src/overrides');
const { writePack } = require('../src/cardData');

const packDir = path.join(__dirname, '../packs');

for (const file of fs.readdirSync(packDir)) {
    const packPath = path.join(packDir, file);
    const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
    const { changed } = applyOverrides(pack.cards);

    if (changed > 0) {
        writePack(packPath, pack);
        console.info(`${file}: ${changed} fields changed`);
    }
}
