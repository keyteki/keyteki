export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

const imageAssets = import.meta.glob('./assets/img/**/*.{png,jpg,jpeg,svg}', {
    eager: true,
    import: 'default'
});
const imageUrl = (path) => imageAssets[`./assets/img/${path}`];

export const Constants = {
    Houses: [
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
    ],
    HousesNames: [
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
        amber: imageUrl('enhancements/amber.png'),
        capture: imageUrl('enhancements/capture.png'),
        draw: imageUrl('enhancements/draw.png'),
        damage: imageUrl('enhancements/damage.png'),
        discard: imageUrl('enhancements/discard.png')
    },
    TideImages: {
        neutral: imageUrl('tide/tide-neutral.png'),
        low: imageUrl('tide/tide-low.png'),
        high: imageUrl('tide/tide.png'),
        card: {}
    },
    Tokens: {
        ModifiedPower: imageUrl('modifiedPower.png'),
        Armor: imageUrl('armor.png')
    },
    MaverickIcon: imageUrl('maverick.png'),
    AnomalyIcon: imageUrl('anomaly.png'),
    DefaultCard: imageUrl('idbacks/identity.jpg'),
    MaverickCornerImage: imageUrl('maverick/maverick-corner.png')
};

for (let locale of Constants.Locales) {
    Constants.TideImages.card[locale] = imageUrl(`tide/tide-card-${locale}.png`);
}

for (let expansion of Constants.Expansions) {
    Constants.SetIconPaths[expansion.value] = imageUrl(`idbacks/${expansion.value}.png`);
    Constants.DeckIconPaths[expansion.value] = imageUrl(`${expansion.value}.png`);
}

for (let type of Constants.CardTypes) {
    Constants.CardTypesPaths[type] = imageUrl(`idbacks/${type}.png`);
}

for (let house of Constants.Houses) {
    Constants.HouseIconPaths[house] = imageUrl(`house/${house}.png`);
    Constants.IdBackHousePaths[house] = imageUrl(`idbacks/idback_houses/${house}.png`);
    Constants.HouseBgPaths[house] = imageUrl(`bgs/${house}.png`);
    Constants.MaverickHouseImages[house] = imageUrl(`maverick/maverick-${house}.png`);
    Constants.MaverickHouseAmberImages[house] = imageUrl(`maverick/maverick-${house}-amber.png`);
    Constants.EnhancementPips[house] = imageUrl(`enhancements/${house}.png`);
}

for (let x = 1; x < 8; x++) {
    Constants.IdBackBlanksPaths[x] = imageUrl(`idbacks/idback_blanks/cardback_${x}.png`);
    Constants.IdBackBlanksPaths[`${x}_evil`] = imageUrl(
        `idbacks/idback_blanks/cardback_${x}_evil.png`
    );
}

Constants.IdBackDecals.santa = imageUrl('idbacks/decals/santa.png');

for (let x = 1; x < 6; x++) {
    Constants.EnhancementBaseImages[x] = imageUrl(`enhancements/base-${x}.png`);
}

export const PatreonClientId = 'HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq';
