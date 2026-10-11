const fs = require('fs');
const path = require('path');

const { Expansions, getExpansion } = require('./expansions');
const { cardIdFromTitle } = require('./cardId');
const { ValidKeywords } = require('./cardData');
const { checkOverrides, loadOverrides } = require('./overrides');

const PackDir = path.join(__dirname, '../packs');
const SchemaDir = path.join(__dirname, '../../server/db/schema');

const CardTypes = [
    'action',
    'archon power',
    'artifact',
    'creature',
    'prophecy',
    'the tide',
    'token creature',
    'upgrade'
];
const Rarities = [
    'Common',
    'Uncommon',
    'Rare',
    'Special',
    'Variant',
    'FIXED',
    'Evil Twin',
    'Token',
    'The Tide'
];
const Locales = [
    'de',
    'en',
    'es',
    'fr',
    'it',
    'ko',
    'pl',
    'pt',
    'ru',
    'th',
    'vi',
    'zhhans',
    'zhhant'
];
// Values are numbers, or X for cards like Xenos Darkshadow
const KeywordPattern = new RegExp(`^(${ValidKeywords.join('|')})(:(\\d+|x))?$`);

/**
 * House codes added by the database seed data and migrations.
 */
function loadDatabaseHouses() {
    const files = [
        ...fs.readdirSync(SchemaDir).filter((file) => file.endsWith('.sql')),
        ...fs.readdirSync(path.join(SchemaDir, 'migrations')).map((file) => `migrations/${file}`)
    ];
    const houses = new Set();
    for (const file of files) {
        const sql = fs.readFileSync(path.join(SchemaDir, file), 'utf8');
        for (const match of sql.matchAll(
            /INSERT INTO (?:public\.)?"Houses" .*?VALUES \(\d+, '([^']+)'/g
        )) {
            houses.add(match[1]);
        }
    }

    return [...houses];
}

function loadPacks() {
    return fs
        .readdirSync(PackDir)
        .sort()
        .map((file) => ({
            file,
            pack: JSON.parse(fs.readFileSync(path.join(PackDir, file), 'utf8'))
        }));
}

/**
 * The ids a card's title can produce: the plain id, an evil twin, or the second half of a
 * gigantic creature.
 */
function allowedIds(card) {
    const base = cardIdFromTitle(card.name);
    if (card.rarity === 'Evil Twin') {
        return [`${base}-evil-twin`];
    }

    return card.type === 'creature' ? [base, `${base}2`] : [base];
}

function isNullableInteger(value) {
    return value === null || Number.isInteger(value);
}

/**
 * Checks the pack files for problems that would break importing cards or decks, and that every
 * override in overrides.json has been applied.
 * @param {{ houses?: string[], overrides?: import('./overrides').Override[] }} [options] houses
 * defaults to the house codes known to the database
 * @returns {string[]} a description of each problem found
 */
function validatePacks({ houses = loadDatabaseHouses(), overrides = loadOverrides() } = {}) {
    const errors = [];
    const overriddenIds = new Set(
        overrides.filter((override) => 'id' in override.set).map((override) => override.set.id)
    );
    const allCards = [];
    const printings = new Map();

    for (const { file, pack } of loadPacks()) {
        const expansion = Expansions.find((e) => e.pack === file);
        const error = (message) => errors.push(`${file}: ${message}`);

        if (!expansion) {
            error('pack is not listed in expansions.json');
        }

        for (const field of ['ids', 'code', 'name', 'cards']) {
            if (!(field in pack)) {
                error(`missing ${field}`);
            }
        }

        const seenInPack = new Set();
        for (const card of pack.cards || []) {
            const key = `${card.expansion}#${card.number}/${card.house}/${card.id}`;
            const cardError = (message) => error(`${key}: ${message}`);

            if (seenInPack.has(key)) {
                cardError('duplicate printing');
            }

            seenInPack.add(key);

            if (typeof card.id !== 'string' || card.id !== card.id.normalize('NFC')) {
                cardError('id must be an NFC normalised string');
            } else if (!overriddenIds.has(card.id) && !allowedIds(card).includes(card.id)) {
                cardError(`id does not match name "${card.name}"`);
            }

            if (typeof card.name !== 'string' || card.name.trim() === '') {
                cardError('missing name');
            }

            if (typeof card.number !== 'string' || card.number === '') {
                cardError('number must be a non-empty string');
            }

            if (typeof card.image !== 'string' || !card.image.startsWith('https://')) {
                cardError('image must be an https url');
            }

            if (!pack.ids || !pack.ids.includes(String(card.expansion))) {
                cardError(`expansion ${card.expansion} is not one of the pack's ids`);
            } else if (!getExpansion(card.expansion)) {
                cardError(`expansion ${card.expansion} is not listed in expansions.json`);
            }

            if (expansion && expansion.supported && !houses.includes(card.house)) {
                cardError(`unknown house ${card.house}`);
            }

            if (!CardTypes.includes(card.type)) {
                cardError(`unknown type ${card.type}`);
            }

            if (!Rarities.includes(card.rarity)) {
                cardError(`unknown rarity ${card.rarity}`);
            }

            if (!Number.isInteger(card.amber) || card.amber < 0) {
                cardError('amber must be a non-negative integer');
            }

            if (!isNullableInteger(card.armor) || !isNullableInteger(card.power)) {
                cardError('armor and power must be integers or null');
            }

            if (typeof card.text !== 'string') {
                cardError('text must be a string');
            }

            for (const field of ['keywords', 'traits']) {
                if (!Array.isArray(card[field]) || card[field].some((v) => typeof v !== 'string')) {
                    cardError(`${field} must be an array of strings`);
                }
            }

            for (const keyword of card.keywords || []) {
                if (!KeywordPattern.test(keyword)) {
                    cardError(`unknown keyword ${keyword}`);
                }
            }

            if (!card.locale || !card.locale.en || !card.locale.en.name) {
                cardError('missing English locale');
            }

            for (const locale of Object.keys(card.locale || {})) {
                if (!Locales.includes(locale)) {
                    cardError(`unknown locale ${locale}`);
                }
            }

            // Anomaly printings appear in several packs, but must be the same card in each
            const printingKey = `${card.expansion}#${card.number}/${card.house}`;
            const existing = printings.get(printingKey);
            if (existing && existing.file !== file && existing.id !== card.id) {
                cardError(`printing is ${existing.id} in ${existing.file}`);
            }

            printings.set(printingKey, { file, id: card.id });
            allCards.push(card);
        }
    }

    return errors.concat(checkOverrides(allCards, overrides));
}

module.exports = { loadDatabaseHouses, validatePacks };
