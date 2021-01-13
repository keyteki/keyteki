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
    'Untamed'
];
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
