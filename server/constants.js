class Constants {}

Constants.Houses = [
    'brobnar',
    'dis',
    'ekwidon',
    'logos',
    'mars',
    'sanctum',
    'saurian',
    'shadows',
    'staralliance',
    'unfathomable',
    'untamed'
];
Constants.HousesNames = [
    'Brobnar',
    'Dis',
    'Ekwidon',
    'Logos',
    'Mars',
    'Sanctum',
    'Saurian',
    'Shadows',
    'Star Alliance',
    'Unfathomable',
    'Untamed'
];
Constants.Expansions = [
    { id: 341, label: 'CotA', tideRequired: false },
    { id: 435, label: 'AoA', tideRequired: false },
    { id: 452, label: 'WC', tideRequired: false },
    { id: 479, label: 'MM', tideRequired: false },
    { id: 496, label: 'DT', tideRequired: true },
    { id: 460, label: 'WoE', tideRequired: true } // TODO WoE
];
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
