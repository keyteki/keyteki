const { DeckExpansions } = require('../master-vault-data/src/expansions');

class Constants {}

Constants.Houses = [
    'brobnar',
    'dis',
    'ekwidon',
    'geistoid',
    'logos',
    'mars',
    'ouboros',
    'redemption',
    'sanctum',
    'saurian',
    'shadows',
    'skyborn',
    'staralliance',
    'unfathomable',
    'untamed'
];
Constants.HousesNames = [
    'Brobnar',
    'Dis',
    'Ekwidon',
    'Geistoid',
    'Logos',
    'Mars',
    'Ouboros',
    'Redemption',
    'Sanctum',
    'Saurian',
    'Shadows',
    'Skyborn',
    'Star Alliance',
    'Unfathomable',
    'Untamed'
];
Constants.Expansions = DeckExpansions.map((expansion) => ({
    id: expansion.id,
    label: expansion.code,
    tideRequired: expansion.tideRequired,
    tokenRequired: expansion.tokenRequired,
    prophecySupported: expansion.prophecySupported
}));
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
