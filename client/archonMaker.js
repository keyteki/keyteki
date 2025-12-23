import { fabric } from 'fabric';
import QRCode from 'qrcode';

import { Constants } from './constants';

const EnhancementBaseImages = {};
const HouseIcons = {};
const IdBackHouseIcons = {};
const CardTypesIcons = {};
const IdBackDecals = {};
const IdBackBlanksIcons = {};
const SetIcons = {};
const DeckCards = { halfSize: {}, cards: {} };
const MaverickHouseImages = {};
const MaverickHouseAmberImages = {};
const EnhancementPipImages = {};
const AccoladeImages = {};
let AnomalyIcon;
let DeckListIcon;
let MaverickIcon;
let TCOIcon;
let DefaultCard;
let MaverickCornerImage;
let Tokens = {};
let cacheLoaded = false;
let Rarities = {};

const imgOptions = {
    selectable: false,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
    noScaleCache: false,
    objectCaching: false
};
const fontProps = {
    fontWeight: 600,
    fontFamily: 'Keyforge',
    textAlign: 'left',
    fontSize: 10,
    enableRetinaScaling: true,
    objectCaching: false,
    noScaleCache: false,
    selectable: false,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false
};
const shadowProps = {
    color: 'Black',
    offsetX: 3,
    offsetY: 3,
    blur: 4
};
const defaultCardWidth = 65;
const cardBackDecal = undefined;

const gigantic2s = [
    'deusillus2',
    'ultra-gravitron2',
    'niffle-kong2',
    'tormax2',
    'wretched-anathema2',
    'sirs-colossus2',
    'bawretchadontius2',
    'boosted-b4-rry2',
    'dodger-s-102',
    'cadet-allison2',
    'j43g3r-v2',
    'titanic-bumblebird2',
    'ascendant-hester2',
    'horizon-saber2'
];

// The MV API doesn't provide proper per-house images for these cards.
const houselessCards = ['build-your-champion', 'digging-up-the-monster', 'tomes-gigantica'];

export const loadImage = (url) => {
    return new Promise((resolve) => {
        fabric.util.loadImage(url, async (image) => {
            if (image) {
                resolve(new fabric.Image(image, imgOptions));
                return;
            }

            const locale = Constants.Locales.find((x) => url.includes(`/${x}/`));
            if (locale) {
                fabric.util.loadImage(url.replace(`/${locale}/`, '/'), (image) => {
                    if (image) {
                        resolve(new fabric.Image(image, imgOptions));
                        return;
                    }
                    resolve(new fabric.Image());
                });
                return;
            }
            resolve(new fabric.Image());
        });
    });
};

async function cacheImages() {
    for (let [house, path] of Object.entries(Constants.HouseIconPaths)) {
        await loadImage(path).then((image) => {
            HouseIcons[house] = image;
        });
    }

    for (let [type, path] of Object.entries(Constants.CardTypesPaths)) {
        await loadImage(path).then((image) => {
            CardTypesIcons[type] = image;
        });
    }

    for (let [house, path] of Object.entries(Constants.IdBackHousePaths)) {
        await loadImage(path).then((image) => {
            IdBackHouseIcons[house] = image;
        });
    }

    for (let [x, path] of Object.entries(Constants.IdBackBlanksPaths)) {
        await loadImage(path).then((image) => {
            IdBackBlanksIcons[x] = image;
        });
    }

    for (let [key, path] of Object.entries(Constants.SetIconPaths)) {
        await loadImage(path).then((image) => {
            SetIcons[key] = image;
        });
    }

    for (let [key, path] of Object.entries(Constants.EnhancementBaseImages)) {
        await loadImage(path).then((image) => {
            EnhancementBaseImages[key] = image;
        });
    }

    for (let [key, path] of Object.entries(Constants.EnhancementPips)) {
        await loadImage(path).then((image) => {
            EnhancementPipImages[key] = image;
        });
    }

    if (cardBackDecal) {
        IdBackDecals[cardBackDecal] = await loadImage(Constants.IdBackDecals[cardBackDecal]);
    }

    TCOIcon = await loadImage(require('./assets/img/idbacks/tco.png'));
    DeckListIcon = await loadImage(require('./assets/img/idbacks/decklist-h.png'));
    Rarities.Common = await loadImage(require('./assets/img/idbacks/Common.png'));
    Rarities.Token = Rarities.Rare = await loadImage(require('./assets/img/idbacks/Rare.png'));
    Rarities.Special = await loadImage(require('./assets/img/idbacks/Special.png'));
    Rarities.Uncommon = await loadImage(require('./assets/img/idbacks/Uncommon.png'));
    Rarities['Evil Twin'] = await loadImage(require('./assets/img/idbacks/evil-twin.png'));
    Rarities['The Tide'] = await loadImage(require('./assets/img/idbacks/tide.png'));
    MaverickIcon = await loadImage(Constants.MaverickIcon);
    AnomalyIcon = await loadImage(Constants.AnomalyIcon);
    DefaultCard = await loadImage(Constants.DefaultCard);
    Tokens.ModifiedPower = await loadImage(Constants.Tokens.ModifiedPower);
    Tokens.armor = await loadImage(Constants.Tokens.Armor);
    cacheLoaded = true;
}

const cardData = {
    size: 20,
    start: { x: 56, y: 148 }
};

const placeCard = (canvas, card, language, x, y) => {
    const name = card.locale && card.locale[language] ? card.locale[language].name : card.name;

    const rarity = new fabric.Image(Rarities[card.rarity].toCanvasElement(), imgOptions);
    rarity
        .set({
            left: x,
            top: y,
            shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 })
        })
        .scaleToWidth(cardData.size);

    const number = new fabric.Text(card.number.toString(), fontProps).set({
        left: x + rarity.getScaledWidth() + 2,
        top: y + 2,
        fontSize: 17
    });

    const typeIcon = new fabric.Image(CardTypesIcons[card.type].toCanvasElement(), imgOptions);
    typeIcon
        .set({
            left: x + rarity.getScaledWidth() + number.getScaledWidth() + 2,
            top: y,
            shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 })
        })
        .scaleToWidth(cardData.size);

    const title = new fabric.Text(name, {
        ...fontProps,
        fontWeight: 300,
        fontSize: 17,
        fill: card.enhancements ? '#0081ad' : 'black'
    }).set({
        left: x + rarity.getScaledWidth() + 32 + typeIcon.getScaledWidth(),
        top: y + 2
    });
    canvas.add(number, title, rarity, typeIcon);
    let iconX =
        x + rarity.getScaledWidth() + 32 + typeIcon.getScaledWidth() + title.getScaledWidth() + 2;

    if (card.is_maverick) {
        const maverickImage = new fabric.Image(MaverickIcon.toCanvasElement(), imgOptions);
        maverickImage
            .set({ left: iconX, top: y, shadow: new fabric.Shadow(shadowProps) })
            .scaleToHeight(cardData.size);
        canvas.add(maverickImage);
        iconX = iconX + 20;
    }

    if (card.is_anomaly) {
        const anomalyImage = new fabric.Image(AnomalyIcon.toCanvasElement(), imgOptions);
        anomalyImage
            .set({ left: iconX, top: y, shadow: new fabric.Shadow(shadowProps) })
            .scaleToHeight(cardData.size);
        canvas.add(anomalyImage);
    }

    if (card.rarity == 'Token') {
        const tokenHouseImage = new fabric.Image(
            HouseIcons[card.house].toCanvasElement(),
            imgOptions
        );

        tokenHouseImage
            .set({
                left: iconX,
                top: y,
                shadow: new fabric.Shadow(shadowProps)
            })
            .scaleToWidth(20)
            .scaleToHeight(20);
        canvas.add(tokenHouseImage);
    }
};

const placeCardCompact = (canvas, card, language, x, y) => {
    const name = card.locale && card.locale[language] ? card.locale[language].name : card.name;

    // Truncate name if it's too long
    const maxLength = 16;
    const truncatedName = name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;

    const rarity = new fabric.Image(Rarities[card.rarity].toCanvasElement(), imgOptions);
    rarity
        .set({
            left: x,
            top: y,
            shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 })
        })
        .scaleToWidth(cardData.size);

    const number = new fabric.Text(card.number.toString(), fontProps).set({
        left: x + rarity.getScaledWidth() + 2,
        top: y + 2,
        fontSize: 17
    });

    const typeIcon = new fabric.Image(CardTypesIcons[card.type].toCanvasElement(), imgOptions);
    typeIcon
        .set({
            left: x + rarity.getScaledWidth() + number.getScaledWidth() + 2,
            top: y,
            shadow: new fabric.Shadow({ ...shadowProps, offsetX: 1, offsetY: 1, blur: 1 })
        })
        .scaleToWidth(cardData.size);

    const title = new fabric.Text(truncatedName, {
        ...fontProps,
        fontWeight: 300,
        fontSize: 17,
        fill: card.enhancements ? '#0081ad' : 'black'
    }).set({
        left: x + rarity.getScaledWidth() + 32 + typeIcon.getScaledWidth(),
        top: y + 2
    });

    canvas.add(number, title, rarity, typeIcon);
};

export const buildDeckList = async (
    canvas,
    deck,
    language,
    translate,
    size,
    showAccolades = true
) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const width = 840;
    const order = ['action', 'artifact', 'creature', 'upgrade'];

    const fontProps = {
        fontWeight: 800,
        fontFamily: 'Keyforge',
        textAlign: 'left',
        fillStyle: 'black',
        fontSize: 20
    };
    const lineStyle = { fill: 'black', stroke: 'black', strokeWidth: 2 };

    if (!deck.houses) {
        canvas.setWidth(width);
        canvas.setHeight(600);
        buildFailImage(canvas, size, width, 600);
        return;
    }

    // Process cards first to determine if we have prophecies
    let cardList = [];
    let nonDeckCards = [];
    let prophecyCards = [];

    for (const { count, card } of deck.cards) {
        if (!card || card.isNonDeck) {
            // Skip archon power cards
            if (card && card.type === 'archon power') {
                continue;
            }
            if (card && card.type === 'prophecy') {
                prophecyCards.push(card);
            } else {
                nonDeckCards.push(card);
            }
            continue;
        }

        for (let i = 0; i < count; i++) {
            cardList.push({
                ...card,
                is_maverick: !!card.maverick,
                is_anomaly: !!card.anomaly,
                enhancements: card.enhancements,
                type: card.type.replace(/\d/g, ''),
                rarity:
                    card.rarity === 'FIXED' || card.rarity === 'Variant' ? 'Special' : card.rarity
            });
        }
    }

    // Extend height to accommodate prophecy cards properly
    const height = prophecyCards.length > 0 ? 630 : 600;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const houseData = {
        size: 35,
        0: { x: 50, y: 101 },
        1: { x: 306, y: 101 },
        2: { x: 562, y: 101 }
    };
    const qrCode = await QRCode.toCanvas(
        fabric.util.createCanvasElement(),
        `https://www.keyforgegame.com/deck-details/${deck.uuid}`,
        { margin: 3 }
    );

    const QRCodeIcon = new fabric.Image(qrCode, imgOptions);
    const expansion = new fabric.Image(SetIcons[deck.expansion].toCanvasElement(), imgOptions);
    const TCO = new fabric.Image(TCOIcon.toCanvasElement(), imgOptions);

    const line1 = new fabric.Line([80, 136, 288, 136], lineStyle);
    const line2 = new fabric.Line([336, 136, 544, 136], lineStyle);
    const line3 = new fabric.Line([592, 136, 800, 136], lineStyle);
    const text = new fabric.Text('DECK LIST', { ...fontProps, fontWeight: 200 });

    QRCodeIcon.set({ left: 737, top: 13 }).scaleToWidth(90);
    expansion.set({ left: 185, top: 72 }).scaleToWidth(20);
    // Position TCO icon based on actual height
    const tcoTop = height - 33; // 33px from bottom
    TCO.set({ left: 757, top: tcoTop }).scaleToWidth(40);
    text.set({ left: 210, top: 72 });
    canvas.add(DeckListIcon, line1, line2, line3, QRCodeIcon, expansion, text, TCO);

    const accoladePromises = [];
    if (showAccolades && deck.accolades && deck.accolades.length > 0) {
        const maxAccolades = 4;
        const accoladesToShow = deck.accolades.slice(0, maxAccolades);
        for (const accolade of accoladesToShow) {
            if (!AccoladeImages[accolade.image]) {
                accoladePromises.push(
                    loadImage(accolade.image).then((img) => {
                        AccoladeImages[accolade.image] = img;
                    })
                );
            }
        }
    }

    let name;
    try {
        name = new fabric.Textbox(deck.name, {
            width: 380,
            left: 60,
            top: 29,
            textAlign: 'center',
            fontFamily: 'Keyforge',
            fontSize: 20,
            fontWeight: 300,
            fill: '#fff',
            shadow: 'rgba(0,0,0,0.3) 5px 5px 5px'
        });
    } catch (err) {
        name = false;
    }
    if (name) {
        canvas.add(name);
    }

    for (const [index, house] of deck.houses.sort().entries()) {
        const houseImage = new fabric.Image(HouseIcons[house].toCanvasElement(), imgOptions);
        houseImage
            .set({
                left: houseData[index].x,
                top: houseData[index].y,
                shadow: new fabric.Shadow(shadowProps)
            })
            .scaleToWidth(30)
            .scaleToHeight(30);

        const houseText = new fabric.Text(
            translate(house).replace(/^\w/, (c) => c.toUpperCase()),
            {
                ...fontProps,
                fontWeight: 800,
                fontSize: 25
            }
        ).set({ left: houseData[index].x + 35, top: houseData[index].y + 5 });
        canvas.add(houseText).add(houseImage);
    }

    // Place prophecies in a single row evenly spaced across the bottom
    if (prophecyCards.length > 0) {
        const prophecyY = 538;
        // Each prophecy card takes approximately 150px width, use 170px spacing between starts
        const cardSpacing = 190;
        const startX = 60; // Left-aligned with left margin

        for (const [index, card] of prophecyCards.entries()) {
            const x = startX + index * cardSpacing;
            placeCardCompact(canvas, card, language, x, prophecyY);
        }
    }

    // Place other non-deck cards after prophecies
    for (const [index, card] of nonDeckCards.entries()) {
        const x = cardData.start.x;
        const y = (prophecyCards.length > 0 ? 566 : 538) + index * 28;
        placeCard(canvas, card, language, x, y);
    }

    cardList
        .sort((a, b) => +a.number - +b.number)
        .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
        .sort((a, b) => deck.houses.sort().indexOf(a.house) - deck.houses.sort().indexOf(b.house));
    for (const [index, card] of cardList.entries()) {
        let x = cardData.start.x,
            y = cardData.start.y + index * 28;

        if (index > 11) {
            x = 312;
            y = cardData.start.y - 336 + index * 28;
        }

        if (index > 23) {
            x = 568;
            y = cardData.start.y - 672 + index * 28;
        }

        placeCard(canvas, card, language, x, y);

        canvas.renderAll();
    }

    if (showAccolades && deck.accolades && deck.accolades.length > 0) {
        const maxAccolades = 4;
        const accoladeSize = 50;
        const accoladesToShow = deck.accolades.slice(0, maxAccolades);
        const spacing = 8;
        const startX = 450;
        const accoladeY = 35;

        if (accoladePromises.length > 0) {
            await Promise.all(accoladePromises);
        }

        for (const [index, accolade] of accoladesToShow.entries()) {
            if (AccoladeImages[accolade.image]) {
                const accoladeImage = new fabric.Image(
                    AccoladeImages[accolade.image].toCanvasElement(),
                    imgOptions
                );
                accoladeImage.scaleToWidth(accoladeSize);
                accoladeImage.scaleToHeight(accoladeSize);
                accoladeImage.set({
                    left: startX + index * (accoladeSize + spacing),
                    top: accoladeY,
                    shadow: new fabric.Shadow(shadowProps)
                });
                canvas.add(accoladeImage);
            }
        }
    }

    applyFilters(canvas, size, width);
};

/**
 * @param canvas
 * @param {import('./Components/Decks/DeckList').Deck} deck
 * @param size
 * @param showDeckName
 */
export const buildCardBack = async (canvas, deck, size, showDeckName) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const width = 300;
    const height = 420;

    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!deck.houses) {
        buildFailImage(canvas, size, width, height);
        return;
    }

    const evil = deck.cards.some((card) => card.card && card.card.rarity === 'Evil Twin');

    let hash = deck.name.split('').reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    let number = ((hash < 0 ? -hash : hash) % 7) + 1;

    if (!IdBackBlanksIcons[number]) {
        number = 1;
    }

    const cardback = new fabric.Image(
        IdBackBlanksIcons[`${number}${evil ? '_evil' : ''}`].toCanvasElement(),
        imgOptions
    );
    const house1 = new fabric.Image(IdBackHouseIcons[deck.houses[0]].toCanvasElement(), imgOptions);
    const house2 = new fabric.Image(IdBackHouseIcons[deck.houses[1]].toCanvasElement(), imgOptions);
    const house3 = new fabric.Image(IdBackHouseIcons[deck.houses[2]].toCanvasElement(), imgOptions);

    cardback.scaleToWidth(width);
    house1.scaleToWidth(75);
    house2.scaleToWidth(75);
    house3.scaleToWidth(75);
    house1.set({ left: 22.5, top: 35 });
    house2.set({ left: 112.5, top: 10 });
    house3.set({ left: 202.5, top: 35 });
    canvas.add(cardback);
    canvas.add(house1);
    canvas.add(house2);
    canvas.add(house3);

    if (cardBackDecal) {
        const decal = new fabric.Image(IdBackDecals[cardBackDecal].toCanvasElement(), imgOptions);
        decal.scaleToWidth(width);
        canvas.add(decal);
    }

    if (showDeckName) {
        let text;
        try {
            text = getCircularText(deck.name, width, height, 1400);
        } catch (err) {
            text = undefined;
        }
        if (text) {
            text.set({ top: 345 });
            canvas.add(text);
        }
    }

    applyFilters(canvas, size, width);
};

/**
 * @param canvas
 * @param maverick
 * @param anomaly
 * @param enhancements
 * @param image
 * @param url
 * @param size
 * @param halfSize
 * @param modifiedPower
 * @param tokens
 * @param card
 */
export const buildCard = async (
    canvas,
    {
        maverick,
        anomaly,
        number,
        enhancements,
        image,
        url,
        size,
        halfSize,
        modifiedPower,
        tokens = {},
        showAccolades = true,
        ...card
    }
) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const tokenFontProps = {
        ...fontProps,
        fill: '#fdfbfa',
        fontSize: 35,
        fontFamily: 'Bombardier',
        fontWeight: 500,
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        stroke: 'black',
        strokeWidth: 3,
        paintFirst: 'stroke'
    };

    if (!DeckCards[halfSize ? 'halfSize' : 'cards'][image]) {
        DeckCards[halfSize ? 'halfSize' : 'cards'][image] = await loadImage(url);
    }

    const width = 300;
    const height = halfSize ? 262.5 : 420;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const cardImage = new fabric.Image(
        DeckCards[halfSize ? 'halfSize' : 'cards'][image].toCanvasElement(),
        imgOptions
    );
    cardImage.scaleToWidth(width);
    canvas.add(cardImage);

    const amber = card.cardPrintedAmber ? card.cardPrintedAmber : card.amber;
    const bonusIcons = amber > 0 || (enhancements && enhancements.length > 0);

    //house overlay
    if (
        maverick ||
        anomaly ||
        houselessCards.includes(card.id) ||
        (number && (number[0] === 'R' || number[0] === 'S'))
    ) {
        let house;
        if (maverick) {
            if (!MaverickCornerImage) {
                MaverickCornerImage = await loadImage(Constants.MaverickCornerImage);
            }
            MaverickCornerImage.set({ left: 210 });
            canvas.add(MaverickCornerImage);
            house = maverick;
        } else if (anomaly) {
            house = anomaly;
        } else {
            house = card.house || card.printedHouse;
        }

        if (bonusIcons) {
            if (!MaverickHouseAmberImages[house]) {
                MaverickHouseAmberImages[house] = await loadImage(
                    Constants.MaverickHouseAmberImages[house]
                );
            }
            canvas.add(MaverickHouseAmberImages[house]);
        } else {
            if (!MaverickHouseImages[house]) {
                MaverickHouseImages[house] = await loadImage(Constants.MaverickHouseImages[house]);
            }
            canvas.add(MaverickHouseImages[house]);
        }
    }
    if (enhancements && enhancements.length > 0 && enhancements[0] !== '') {
        const baseImage = new fabric.Image(
            EnhancementBaseImages[enhancements.length].toCanvasElement(),
            imgOptions
        );
        let top = 59 + (amber ? amber * 30 : 0);

        if (gigantic2s.some((x) => x === card.id) && !image.includes('complete')) {
            baseImage.set({ left: width - top, top: 14, angle: 90 });
        } else {
            baseImage.set({ left: 14, top });
        }

        canvas.add(baseImage);

        for (const [index, pip] of enhancements.entries()) {
            let pipKey = pip.replace(/[ ]/gi, ''); // "star alliance" -> "staralliance"
            const pipImage = new fabric.Image(
                EnhancementPipImages[pipKey].toCanvasElement(),
                imgOptions
            );

            if (gigantic2s.some((x) => x === card.id) && !image.includes('complete')) {
                pipImage.set({ left: width - top - 8 - index * 31, top: 21, angle: 90 });
            } else {
                pipImage.set({ left: 21, top: top + 10 + index * 31 });
            }

            canvas.add(pipImage);
        }
    }
    if (
        showAccolades &&
        card.accolades &&
        card.accolades.length > 0 &&
        !halfSize &&
        card.location === 'zoom'
    ) {
        const maxAccolades = 3;
        const accoladeSize = 40;
        const accoladesToShow = card.accolades.slice(0, maxAccolades);
        const accoladeX = 235;
        const spacing = 55;

        let startY;
        if (card.type === 'creature' || card.type === 'action') {
            startY = 25;
        } else if (card.type === 'upgrade') {
            startY = 200;
        } else {
            startY = 65;
        }

        for (const [index, accolade] of accoladesToShow.entries()) {
            if (!AccoladeImages[accolade.image]) {
                AccoladeImages[accolade.image] = await loadImage(accolade.image);
            }
            const accoladeImage = new fabric.Image(
                AccoladeImages[accolade.image].toCanvasElement(),
                imgOptions
            );
            accoladeImage.scaleToWidth(accoladeSize);
            accoladeImage.set({
                left: accoladeX,
                top: startY + index * spacing,
                shadow: new fabric.Shadow(shadowProps)
            });
            canvas.add(accoladeImage);
        }
    }
    if (card.location === 'play area') {
        if (card.type === 'creature') {
            //dynamic power overlay
            let totalPower = modifiedPower - (tokens.power ? tokens.power : 0);
            if (modifiedPower && totalPower !== card.printedPower) {
                const modifiedPowerToken = new fabric.Image(
                    Tokens.ModifiedPower.toCanvasElement(),
                    imgOptions
                );
                let left = 10;
                let top = 220;

                if (halfSize) {
                    top -= 25;
                } else if (image.includes('-complete')) {
                    top += 30;
                    left -= 5;
                } else if (card.isToken) {
                    top += 27;
                }

                modifiedPowerToken.scaleToWidth(60);
                modifiedPowerToken.set({ left, top: top });
                canvas.add(modifiedPowerToken);
                const powerText = new fabric.Text(totalPower.toString(), tokenFontProps);
                powerText.set({
                    left: left + 30,
                    top: top + 30,
                    shadow: new fabric.Shadow(shadowProps)
                });
                canvas.add(powerText);
            }
            //armor overlay
            if (tokens.armor || card.printedArmor) {
                const modifiedArmorToken = new fabric.Image(
                    Tokens.armor.toCanvasElement(),
                    imgOptions
                );
                let left = 230;
                let top = 220;

                if (halfSize) {
                    top -= 25;
                } else if (image.includes('-complete')) {
                    top += 30;
                    left += 5;
                } else if (card.isToken) {
                    top += 27;
                }

                modifiedArmorToken.scaleToWidth(60);
                modifiedArmorToken.set({ left, top });
                canvas.add(modifiedArmorToken);
                const armorText = new fabric.Text(
                    tokens.armor ? tokens.armor.toString() : '0',
                    tokenFontProps
                );
                armorText.set({
                    left: left + 30,
                    top: top + 30,
                    shadow: new fabric.Shadow(shadowProps)
                });
                canvas.add(armorText);
            }
        }
        //tokens
        const printTokens = getCountersForCard({ ...card, tokens });
        if (tokens) {
            for (const [index, { name, count, fade, showValue }] of printTokens.entries()) {
                if (!Tokens[name]) {
                    Tokens[name] = await loadImage(require(`./assets/img/${name}.png`));
                }

                const TokenImage = new fabric.Image(Tokens[name].toCanvasElement(), imgOptions);
                TokenImage.set({ originX: 'center', originY: 'center', opacity: fade ? 0.6 : 1 });
                TokenImage.scaleToWidth(100);
                let top, left;
                const position = [50, 150, 250];
                if (Object.keys(printTokens).length <= 2) {
                    top = (index + 1) * 95;
                    left = 150;
                } else {
                    top = (Math.floor(index / 3) + 1) * 95;
                    left = position[index % 3];
                }
                TokenImage.set({ top, left });
                canvas.add(TokenImage);
                if (showValue) {
                    const TokenText = new fabric.Text(count.toString(), tokenFontProps);
                    TokenText.set({
                        top,
                        left: left + (name === 'power' ? 4 : -1),
                        fontSize: 50,
                        shadow: new fabric.Shadow(shadowProps)
                    });
                    canvas.add(TokenText);
                }
            }
        }
    }
    applyFilters(canvas, size, width);
};

const buildFailImage = (canvas, size, width) => {
    const defaultCardImage = new fabric.Image(DefaultCard.toCanvasElement(), imgOptions);
    defaultCardImage.scaleToWidth(width);
    canvas.add(defaultCardImage);
    applyFilters(canvas, size, width);
};

const applyFilters = (canvas, size, width) => {
    canvas.renderAll();
    const scale = size ? (defaultCardWidth * getCardSizeMultiplier(size)) / width : 1;
    const finalImage = new fabric.Image(canvas.toCanvasElement(), imgOptions);
    finalImage.filters.push(
        new fabric.Image.filters.Resize({
            resizeType: 'lanczos',
            lanczosLobes: 3,
            scaleX: scale,
            scaleY: scale
        })
    );
    canvas.clear();
    finalImage.applyFilters();
    finalImage.scaleToWidth(width);
    canvas.add(finalImage);
    canvas.renderAll();
};

const getCardSizeMultiplier = (size) => {
    switch (size) {
        case 'icon':
            return 0.3;
        case 'small':
            return 0.6;
        case 'large':
            return 1.4;
        case 'x-large':
            return 2;
        case 'xx-large':
            return 8;
    }

    return 1;
};

const getCurvedFontSize = (length) => {
    const size = (15 / length) * 30;
    if (size > 15) {
        return 0.045;
    }

    return size / 300;
};

const getCircularText = (
    text = '',
    width,
    height,
    diameter,
    fontSize = getCurvedFontSize(text.length) * height
) => {
    let canvas, ctx;
    try {
        canvas = fabric.util.createCanvasElement();
        canvas.id = 'circular-text';
    } catch (err) {
        return;
    }

    try {
        ctx = canvas.getContext('2d');
    } catch (err) {
        return;
    }

    let textHeight = 40,
        startAngle = 0;

    canvas.width = width;
    canvas.height = height;
    ctx.font = `${fontSize}px Keyforge`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgb(32,32,32)';
    ctx.lineWidth = 1;

    text = text.split('').reverse().join('');

    ctx.translate(width / 2, diameter / 2); // Move to center
    ctx.textBaseline = 'middle'; // Ensure we draw in exact center
    ctx.textAlign = 'center'; // Ensure we draw in exact center

    for (let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width;
        startAngle += charWid / (diameter / 2 - textHeight) / 2;
    }

    ctx.rotate(startAngle);

    for (let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width; // half letter
        ctx.rotate((charWid / 2 / (diameter / 2 - textHeight)) * -1);
        ctx.strokeText(text[j], 0, 0 - diameter / 2 + textHeight / 2);
        ctx.fillText(text[j], 0, 0 - diameter / 2 + textHeight / 2);
        ctx.rotate((charWid / 2 / (diameter / 2 - textHeight)) * -1); // rotate half letter
    }
    return new fabric.Image(canvas, imgOptions);
};

const getCountersForCard = (card) => {
    const singleValueCounters = ['ward', 'enrage', 'doom', 'stun'];
    const order = [
        'amber',
        'damage',
        'power',
        'ward',
        'enrage',
        'stun',
        'awakening',
        'depth',
        'disruption',
        'doom',
        'fuse',
        'glory',
        'growth',
        'ignorance',
        'knowledge',
        'scheme',
        'time',
        'warrant',
        'yea',
        'nay',
        'wisdom',
        'hatch',
        'paint',
        'trade',
        'mineralize',
        'mutation'
    ];
    let counters = [];

    for (const [key, token] of Object.entries(card.tokens || {})) {
        if (key === 'armor') {
            continue;
        }
        counters.push({
            name: key,
            count: token,
            fade: key === 'ward' && card.wardBroken,
            showValue: token > 1 || !singleValueCounters.includes(key)
        });
    }

    for (const upgrade of card.upgrades || []) {
        counters = counters.concat(getCountersForCard(upgrade));
    }

    counters = counters.filter((counter) => counter.count >= 0);
    counters = counters.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    if (card.pseudoDamage) {
        counters.unshift({
            name: 'damage',
            count: card.pseudoDamage,
            fade: true,
            showValue: true
        });
    }

    return counters;
};
