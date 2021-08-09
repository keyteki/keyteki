export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

export const Constants = {
    Houses: [
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
    ],
    HousesNames: [
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
    ],
    Locales: ['de', 'en', 'es', 'fr', 'it', 'ko', 'pt', 'pl', 'th', 'zhhans', 'zhhant'],
    Expansions: [
        { value: '341', label: 'CotA' },
        { value: '435', label: 'AoA' },
        { value: '452', label: 'WC' },
        { value: '479', label: 'MM' },
        { value: '496', label: 'DT' }
    ],
    CardTypes: ['action', 'artifact', 'creature', 'upgrade'],
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
        damage: require('./assets/img/enhancements/damage.png')
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
