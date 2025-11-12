// Import all static images
import amberImg from './assets/img/enhancements/amber.png';
import captureImg from './assets/img/enhancements/capture.png';
import drawImg from './assets/img/enhancements/draw.png';
import damageImg from './assets/img/enhancements/damage.png';
import discardImg from './assets/img/enhancements/discard.png';

import tideNeutral from './assets/img/tide/tide-neutral.png';
import tideLow from './assets/img/tide/tide-low.png';
import tideHigh from './assets/img/tide/tide.png';

import modifiedPowerImg from './assets/img/modifiedPower.png';
import armorImg from './assets/img/armor.png';
import maverickImg from './assets/img/maverick.png';
import anomalyImg from './assets/img/anomaly.png';
import defaultCardImg from './assets/img/idbacks/identity.jpg';
import maverickCornerImg from './assets/img/maverick/maverick-corner.png';

// Use Vite's import.meta.glob for dynamic imports
// These return { './path/to/file.png': urlString }
const tideCardImages = import.meta.glob('./assets/img/tide/tide-card-*.png', {
    eager: true,
    import: 'default'
});
const allIdbackImages = import.meta.glob('./assets/img/idbacks/*.png', {
    eager: true,
    import: 'default'
});
const allMainImages = import.meta.glob('./assets/img/*.png', { eager: true, import: 'default' });
const houseIcons = import.meta.glob('./assets/img/house/*.png', { eager: true, import: 'default' });
const idBackHouses = import.meta.glob('./assets/img/idbacks/idback_houses/*.png', {
    eager: true,
    import: 'default'
});
const houseBgs = import.meta.glob('./assets/img/bgs/*.png', { eager: true, import: 'default' });
const maverickHouses = import.meta.glob('./assets/img/maverick/maverick-*.png', {
    eager: true,
    import: 'default'
});
const enhancementImages = import.meta.glob('./assets/img/enhancements/*.png', {
    eager: true,
    import: 'default'
});
const idBackBlanks = import.meta.glob('./assets/img/idbacks/idback_blanks/*.png', {
    eager: true,
    import: 'default'
});
const idBackDecals = import.meta.glob('./assets/img/idbacks/decals/*.png', {
    eager: true,
    import: 'default'
});

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
    ColorClassByRole: {
        admin: 'text-red-500',
        contributor: 'text-blue-400',
        supporter: 'text-green-500',
        winner: 'text-yellow-200',
        previouswinner: 'text-pink-500'
    },
    EnhancementPips: {
        amber: amberImg,
        capture: captureImg,
        draw: drawImg,
        damage: damageImg,
        discard: discardImg
    },
    TideImages: {
        neutral: tideNeutral,
        low: tideLow,
        high: tideHigh,
        card: {}
    },
    Tokens: {
        ModifiedPower: modifiedPowerImg,
        Armor: armorImg
    },
    MaverickIcon: maverickImg,
    AnomalyIcon: anomalyImg,
    DefaultCard: defaultCardImg,
    MaverickCornerImage: maverickCornerImg
};

// Populate tide card images
for (let locale of Constants.Locales) {
    const key = `./assets/img/tide/tide-card-${locale}.png`;
    if (tideCardImages[key]) {
        Constants.TideImages.card[locale] = tideCardImages[key];
    }
}

// Populate expansion icons
for (let expansion of Constants.Expansions) {
    const setKey = `./assets/img/idbacks/${expansion.value}.png`;
    const deckKey = `./assets/img/${expansion.value}.png`;

    if (allIdbackImages[setKey]) {
        Constants.SetIconPaths[expansion.value] = allIdbackImages[setKey];
    }
    if (allMainImages[deckKey]) {
        Constants.DeckIconPaths[expansion.value] = allMainImages[deckKey];
    }
}

// Populate card type images
for (let type of Constants.CardTypes) {
    const key = `./assets/img/idbacks/${type}.png`;
    if (allIdbackImages[key]) {
        Constants.CardTypesPaths[type] = allIdbackImages[key];
    }
}

// Populate house images
for (let house of Constants.Houses) {
    const houseKey = `./assets/img/house/${house}.png`;
    const idBackKey = `./assets/img/idbacks/idback_houses/${house}.png`;
    const bgKey = `./assets/img/bgs/${house}.png`;
    const maverickKey = `./assets/img/maverick/maverick-${house}.png`;
    const maverickAmberKey = `./assets/img/maverick/maverick-${house}-amber.png`;
    const enhancementKey = `./assets/img/enhancements/${house}.png`;

    if (houseIcons[houseKey]) Constants.HouseIconPaths[house] = houseIcons[houseKey];
    if (idBackHouses[idBackKey]) Constants.IdBackHousePaths[house] = idBackHouses[idBackKey];
    if (houseBgs[bgKey]) Constants.HouseBgPaths[house] = houseBgs[bgKey];
    if (maverickHouses[maverickKey])
        Constants.MaverickHouseImages[house] = maverickHouses[maverickKey];
    if (maverickHouses[maverickAmberKey])
        Constants.MaverickHouseAmberImages[house] = maverickHouses[maverickAmberKey];
    if (enhancementImages[enhancementKey])
        Constants.EnhancementPips[house] = enhancementImages[enhancementKey];
}

// Populate blank card backs
for (let x = 1; x < 8; x++) {
    const blankKey = `./assets/img/idbacks/idback_blanks/cardback_${x}.png`;
    const evilKey = `./assets/img/idbacks/idback_blanks/cardback_${x}_evil.png`;

    if (idBackBlanks[blankKey]) Constants.IdBackBlanksPaths[x] = idBackBlanks[blankKey];
    if (idBackBlanks[evilKey]) Constants.IdBackBlanksPaths[`${x}_evil`] = idBackBlanks[evilKey];
}

// Populate decals
const santaKey = './assets/img/idbacks/decals/santa.png';
if (idBackDecals[santaKey]) Constants.IdBackDecals.santa = idBackDecals[santaKey];

// Populate enhancement base images
for (let x = 1; x < 6; x++) {
    const key = `./assets/img/enhancements/base-${x}.png`;
    if (enhancementImages[key]) Constants.EnhancementBaseImages[x] = enhancementImages[key];
}

export const PatreonClientId = 'HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq';
