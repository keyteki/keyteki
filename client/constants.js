export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

export const Constants = {
    Houses: [
        'brobnar',
        'dis',
        'ekwidon',
        'geistoid',
        'keyraken',
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
    ],
    HousesNames: [
        'Brobnar',
        'Dis',
        'Ekwidon',
        'Geistoid',
        'Keyraken',
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
    ],
    Locales: ['de', 'en', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'th', 'zhhans', 'zhhant'],
    Expansions: [
        { value: '341', label: 'CotA', tideRequired: false },
        { value: '435', label: 'AoA', tideRequired: false },
        { value: '452', label: 'WC', tideRequired: false },
        { value: '479', label: 'MM', tideRequired: false },
        { value: '496', label: 'DT', tideRequired: true },
        { value: '600', label: 'WoE', tideRequired: false },
        { value: '601', label: 'UC2022', tideRequired: false },
        { value: '609', label: 'VM2023', tideRequired: false },
        { value: '700', label: 'GR', tideRequired: false },
        { value: '722', label: 'MG', tideRequired: false },
        { value: '737', label: 'VM2024', tideRequired: false },
        { value: '800', label: 'AS', tideRequired: false },
        { value: '855', label: 'ToC', tideRequired: false },
        { value: '874', label: 'MoMu', tideRequired: false },
        { value: '907', label: 'DISC', tideRequired: false },
        { value: '939', label: 'VM2025', tideRequired: false },
        { value: '886', label: 'PV', tideRequired: false },
        { value: '918', label: 'CC', tideRequired: false }
    ],
    CardTypes: [
        'action',
        'artifact',
        'creature',
        'upgrade',
        'token creature',
        'the tide',
        'prophecy'
    ],
    SetIconPaths: {},
    DeckIconPaths: {},
    HouseIconPaths: {},
    HouseBgPaths: {},
    IdBackBlanksPaths: {},
    IdBackDecals: {},
    IdBackHousePaths: {},
    CardTypesPaths: {},
    EnhancementBaseImages: {},
    MaverickHouseImages: {},
    MaverickHouseAmberImages: {},
    EnhancementPips: {
        amber: require('./assets/img/enhancements/amber.png'),
        capture: require('./assets/img/enhancements/capture.png'),
        draw: require('./assets/img/enhancements/draw.png'),
        damage: require('./assets/img/enhancements/damage.png'),
        discard: require('./assets/img/enhancements/discard.png')
    },
    TideImages: {
        neutral: require('./assets/img/tide/tide-neutral.png'),
        low: require('./assets/img/tide/tide-low.png'),
        high: require('./assets/img/tide/tide.png'),
        card: {}
    },
    Tokens: {
        ModifiedPower: require('./assets/img/modifiedPower.png'),
        Armor: require('./assets/img/armor.png')
    },
    MaverickIcon: require('./assets/img/maverick.png'),
    AnomalyIcon: require('./assets/img/anomaly.png'),
    DefaultCard: require('./assets/img/idbacks/identity.jpg'),
    MaverickCornerImage: require('./assets/img/maverick/maverick-corner.png')
};

for (let locale of Constants.Locales) {
    Constants.TideImages.card[locale] = require(`./assets/img/tide/tide-card-${locale}.png`);
}

for (let expansion of Constants.Expansions) {
    Constants.SetIconPaths[
        expansion.value
    ] = require(`./assets/img/idbacks/${expansion.value}.png`);
    Constants.DeckIconPaths[expansion.value] = require(`./assets/img/${expansion.value}.png`);
}

for (let type of Constants.CardTypes) {
    Constants.CardTypesPaths[type] = require(`./assets/img/idbacks/${type}.png`);
}

for (let house of Constants.Houses) {
    Constants.HouseIconPaths[house] = require(`./assets/img/house/${house}.png`);
    Constants.IdBackHousePaths[house] = require(`./assets/img/idbacks/idback_houses/${house}.png`);
    Constants.HouseBgPaths[house] = require(`./assets/img/bgs/${house}.png`);
    Constants.MaverickHouseImages[house] = require(`./assets/img/maverick/maverick-${house}.png`);
    Constants.MaverickHouseAmberImages[
        house
    ] = require(`./assets/img/maverick/maverick-${house}-amber.png`);
    Constants.EnhancementPips[house] = require(`./assets/img/enhancements/${house}.png`);
}

for (let x = 1; x < 8; x++) {
    Constants.IdBackBlanksPaths[
        x
    ] = require(`./assets/img/idbacks/idback_blanks/cardback_${x}.png`);
    Constants.IdBackBlanksPaths[
        `${x}_evil`
    ] = require(`./assets/img/idbacks/idback_blanks/cardback_${x}_evil.png`);
}

Constants.IdBackDecals.santa = require(`./assets/img/idbacks/decals/santa.png`);

for (let x = 1; x < 6; x++) {
    Constants.EnhancementBaseImages[x] = require(`./assets/img/enhancements/base-${x}.png`);
}

export const PatreonClientId = 'HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq';
