import ExpansionData from '../master-vault-data/expansions.json';

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
        'ouboros',
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
        'Ouboros',
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
        discard: imageUrl('enhancements/discard.png'),
        power: imageUrl('enhancements/power.png')
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

// Expansions that decks can belong to, in release order
Constants.Expansions = ExpansionData.filter(
    (expansion) => expansion.supported !== false && !expansion.anomalies
).map((expansion) => ({
    value: String(expansion.id),
    label: expansion.code,
    name: expansion.name,
    sealedKey: expansion.sealedKey,
    tideRequired: !!expansion.tideRequired,
    tokenRequired: !!expansion.tokenRequired,
    prophecySupported: !!expansion.prophecySupported
}));

Constants.SealedExpansions = Constants.Expansions.filter((expansion) => expansion.sealedKey);

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

// sessionStorage key holding the OAuth state for an in-progress Patreon link
export const PatreonStateKey = 'patreonOAuthState';
