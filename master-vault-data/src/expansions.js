const ExpansionData = require('../expansions.json');

/**
 * @typedef {object} Expansion
 * @property {number} id Master Vault expansion id
 * @property {string} code Code used in the database and UI
 * @property {string} name
 * @property {string} releaseDate Used to order printings, so later sets win over earlier ones
 * @property {string} [pack] Pack file under packs/ holding this expansion's cards
 * @property {string} [sealedKey] Key used by the new game form when choosing sealed expansions
 * @property {boolean} supported False for expansions whose decks can be imported but not played
 * @property {boolean} anomalies True for the expansion id that anomaly printings use
 * @property {boolean} tideRequired
 * @property {boolean} tokenRequired
 * @property {boolean} prophecySupported
 */

/** @type {Expansion[]} */
const Expansions = ExpansionData.map((expansion) => ({
    supported: true,
    anomalies: false,
    tideRequired: false,
    tokenRequired: false,
    prophecySupported: false,
    ...expansion
}));

const ExpansionsById = new Map(Expansions.map((expansion) => [expansion.id, expansion]));

/**
 * Expansions that decks can belong to, in release order.
 */
const DeckExpansions = Expansions.filter(
    (expansion) => expansion.supported && !expansion.anomalies
);

/**
 * @param {number} id
 * @returns {Expansion | undefined}
 */
function getExpansion(id) {
    return ExpansionsById.get(id);
}

/**
 * Orders expansion ids by release date, so that later printings sort last.
 * @param {number} a
 * @param {number} b
 */
function compareByRelease(a, b) {
    const expansionA = ExpansionsById.get(a);
    const expansionB = ExpansionsById.get(b);
    if (!expansionA || !expansionB) {
        return a - b;
    }

    return expansionA.releaseDate.localeCompare(expansionB.releaseDate) || a - b;
}

module.exports = { Expansions, DeckExpansions, getExpansion, compareByRelease };
