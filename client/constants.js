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
        { value: '512', label: 'MM' }
    ],
    SetIconPaths: {},
    HouseIconPaths: {},
    MaverickIcon: require('./assets/img/maverick.png'),
    AnomalyIcon: require('./assets/img/anomaly.png')
};

for (let expansion of Constants.Expansions) {
    Constants.SetIconPaths[
        expansion.value
    ] = require(`./assets/img/idbacks/${expansion.value}.png`);
}

for (let house of Constants.Houses) {
    Constants.HouseIconPaths[house] = require(`./assets/img/idbacks/houses/${house}.png`);
}
