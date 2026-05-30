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
Constants.Expansions = [
    {
        id: 341,
        name: 'cota',
        label: 'CotA',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 435,
        name: 'aoa',
        label: 'AoA',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 452,
        name: 'wc',
        label: 'WC',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 479,
        name: 'mm',
        label: 'MM',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 496,
        name: 'dt',
        label: 'DT',
        tideRequired: true,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 600,
        name: 'woe',
        label: 'WoE',
        tideRequired: false,
        tokenRequired: true,
        prophecySupported: false
    },
    {
        id: 601,
        name: 'uc2022',
        label: 'UC2022',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 609,
        name: 'vm2023',
        label: 'VM2023',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 700,
        name: 'gr',
        label: 'GR',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 737,
        name: 'vm2024',
        label: 'VM2024',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 800,
        name: 'as',
        label: 'AS',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 855,
        name: 'toc',
        label: 'ToC',
        tideRequired: false,
        tokenRequired: true,
        prophecySupported: false
    },
    {
        id: 874,
        name: 'momu',
        label: 'MoMu',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 886,
        name: 'pv',
        label: 'PV',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: true
    },
    {
        id: 907,
        name: 'disc',
        label: 'DISC',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 918,
        name: 'cc',
        label: 'CC',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 928,
        name: 'dm',
        label: 'DM',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 939,
        name: 'vm2025',
        label: 'VM2025',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    },
    {
        id: 964,
        name: 'vm2026',
        label: 'VM2026',
        tideRequired: false,
        tokenRequired: false,
        prophecySupported: false
    }
];
Constants.Tide = Object.freeze({
    HIGH: 'high',
    LOW: 'low',
    NEUTRAL: 'neutral',
    toString: (level) => level.charAt(0).toUpperCase() + level.slice(1)
});

Object.freeze(Constants);

module.exports = Constants;
