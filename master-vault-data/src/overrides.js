const fs = require('fs');
const path = require('path');

const OverridesPath = path.join(__dirname, '../overrides.json');

/**
 * @typedef {object} Override
 * @property {Record<string, any>} match Card fields that identify the card(s) to change
 * @property {Record<string, any>} set Fields to set on the matching cards
 * @property {string} reason Why the Master Vault data is wrong
 */

/** @returns {Override[]} */
function loadOverrides() {
    return JSON.parse(fs.readFileSync(OverridesPath, 'utf8'));
}

function matches(card, match) {
    return Object.entries(match).every(([field, value]) => card[field] === value);
}

/**
 * Applies corrections to imported cards. Converters call this after fetching cards so that
 * manual fixes survive a re-import.
 * @param {any[]} cards
 * @param {Override[]} [overrides]
 * @returns {{ changed: number }}
 */
function applyOverrides(cards, overrides = loadOverrides()) {
    let changed = 0;
    for (const override of overrides) {
        for (const card of cards.filter((c) => matches(c, override.match))) {
            for (const [field, value] of Object.entries(override.set)) {
                if (JSON.stringify(card[field]) !== JSON.stringify(value)) {
                    card[field] = value;
                    changed++;
                }
            }
        }
    }

    return { changed };
}

/**
 * Finds overrides that match no card, or whose changes are missing from the given cards.
 * @param {any[]} cards every card from every pack
 * @param {Override[]} [overrides]
 * @returns {string[]}
 */
function checkOverrides(cards, overrides = loadOverrides()) {
    const errors = [];
    for (const override of overrides) {
        const label = JSON.stringify(override.match);
        const matched = cards.filter((card) => matches(card, override.match));

        if (!override.reason) {
            errors.push(`override ${label} has no reason`);
        }

        if (matched.length === 0) {
            errors.push(`override ${label} matches no cards`);
            continue;
        }

        for (const card of matched) {
            for (const [field, value] of Object.entries(override.set)) {
                if (JSON.stringify(card[field]) !== JSON.stringify(value)) {
                    errors.push(`override ${label} is not applied: ${field} is ${card[field]}`);
                }
            }
        }
    }

    return errors;
}

module.exports = { applyOverrides, checkOverrides, loadOverrides };
