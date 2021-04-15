class Constants {}

Constants.Houses = [
    'brobnar',
    'dis',
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
    { value: '341', label: 'CotA', tideRequired: false },
    { value: '435', label: 'AoA', tideRequired: false },
    { value: '452', label: 'WC', tideRequired: false },
    { value: '479', label: 'MM', tideRequired: false },
    { value: '496', label: 'DT', tideRequired: true }
];
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
