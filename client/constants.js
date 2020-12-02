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
        'Untamed'
    ],
    Expansions: [
        { value: '341', label: 'CotA' },
        { value: '435', label: 'AoA' },
        { value: '452', label: 'WC' },
        { value: '479', label: 'MM' }
    ],
    SetIconPaths: {},
    HouseIconPaths: {},
    HouseBgPaths: {},
    IdBackBlanksPaths: {},
    IdBackHousePaths: {},
    EnhancementBaseImages: {},
    MaverickHouseImages: {},
    MaverickHouseAmberImages: {},
    EnhancementPips: {
        amber: require('./assets/img/enhancements/amber.png'),
        capture: require('./assets/img/enhancements/capture.png'),
        draw: require('./assets/img/enhancements/draw.png'),
        damage: require('./assets/img/enhancements/damage.png')
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

for (let expansion of Constants.Expansions) {
    Constants.SetIconPaths[
        expansion.value
    ] = require(`./assets/img/idbacks/${expansion.value}.png`);
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
}
Constants.IdBackBlanksPaths.halloween = require(`./assets/img/idbacks/idback_blanks/cardback_halloween.png`);

for (let x = 1; x < 6; x++) {
    Constants.EnhancementBaseImages[x] = require(`./assets/img/enhancements/base-${x}.png`);
}

export const PatreonClientId = 'HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq';
