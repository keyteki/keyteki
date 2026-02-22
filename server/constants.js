class Constants {}

Constants.Houses = [
    'brobnar',
    'dis',
    'ekwidon',
    'geistoid',
    'logos',
    'mars',
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
    'Redemption',
    'Sanctum',
    'Saurian',
    'Shadows',
    'Skyborn',
    'Star Alliance',
    'Unfathomable',
    'Untamed'
];
Constants.Expansions = [
    { id: 341, label: 'CotA', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 435, label: 'AoA', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 452, label: 'WC', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 479, label: 'MM', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 496, label: 'DT', tideRequired: true, tokenRequired: false, prophecySupported: false },
    { id: 600, label: 'WoE', tideRequired: false, tokenRequired: true, prophecySupported: false },
    { id: 700, label: 'GR', tideRequired: false, tokenRequired: false, prophecySupported: true },
    { id: 800, label: 'AS', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 855, label: 'ToC', tideRequired: false, tokenRequired: true, prophecySupported: false },
    { id: 874, label: 'MoMu', tideRequired: false, tokenRequired: false, prophecySupported: false },
    { id: 907, label: 'DISC', tideRequired: false, tokenRequired: false, prophecySupported: false },
    {
        id: 939,
        label: 'VM2025',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    { id: 886, label: 'PV', tideRequired: false, tokenRequired: false, prophecySupported: true },
    { id: 918, label: 'CC', tideRequired: false, tokenRequired: false, prophecySupported: false }
];
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
