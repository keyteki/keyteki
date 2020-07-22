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
    MaverickIcon: require('./assets/img/maverick.png'),
    AnomalyIcon: require('./assets/img/anomaly.png'),
    DefaultCard: require('./assets/img/idbacks/identity.jpg')
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
}

for (let x = 1; x < 8; x++) {
    Constants.IdBackBlanksPaths[
        x
    ] = require(`./assets/img/idbacks/idback_blanks/cardback_${x}.png`);
}
