import { fabric } from 'fabric';
import QRCode from 'qrcode';

import { Constants } from './constants';

const EnhancementBaseImages = {};
const HouseIcons = {};
const IdBackHouseIcons = {};
const IdBackBlanksIcons = {};
const SetIcons = {};
const DeckCards = { halfpints: {}, cards: {} };
const MaverickHouseImages = {};
const MaverickHouseAmberImages = {};
const EnhancementPipImages = {};
let AnomalyIcon;
let CommonIcon;
let DeckListIcon;
let MaverickIcon;
let RareIcon;
let SpecialIcon;
let TCOIcon;
let UncommonIcon;
let DefaultCard;
let MaverickCornerImage;
let Tokens = {};
let cacheLoaded = false;
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

export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(
            url,
            (image) => {
                if (!image.getElement()) {
                    reject();
                } else {
                    if (image.width === 0) {
                        return reject();
                    }

                    resolve(image);
                }
            },
            imgOptions
        );
    });
};

async function cacheImages() {
    fabric.initFilterBackend = () => {
        if (
            fabric.enableGLFiltering &&
            fabric.isWebglSupported &&
            fabric.isWebglSupported(fabric.textureSize)
        ) {
            return new fabric.WebglFilterBackend({ tileSize: fabric.textureSize });
        } else if (fabric.Canvas2dFilterBackend) {
            return new fabric.Canvas2dFilterBackend();
        }
    };

    for (let [house, path] of Object.entries(Constants.HouseIconPaths)) {
        await loadImage(path).then((image) => {
            HouseIcons[house] = image;
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

    TCOIcon = await loadImage(require('./assets/img/idbacks/tco.png'));
    DeckListIcon = await loadImage(require('./assets/img/idbacks/decklist.png'));
    CommonIcon = await loadImage(require('./assets/img/idbacks/Common.png'));
    RareIcon = await loadImage(require('./assets/img/idbacks/Rare.png'));
    SpecialIcon = await loadImage(require('./assets/img/idbacks/Special.png'));
    UncommonIcon = await loadImage(require('./assets/img/idbacks/Uncommon.png'));
    MaverickIcon = await loadImage(Constants.MaverickIcon);
    AnomalyIcon = await loadImage(Constants.AnomalyIcon);
    DefaultCard = await loadImage(Constants.DefaultCard);
    Tokens.ModifiedPower = await loadImage(Constants.Tokens.ModifiedPower);
    Tokens.armor = await loadImage(Constants.Tokens.Armor);
    cacheLoaded = true;
}

export const buildDeckList = async (CanvasFinal, deck, language, translate, size) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const width = 600;
    const height = 840;
    const order = ['action', 'artifact', 'creature', 'upgrade'];

    let canvas;
    try {
        canvas = new fabric.StaticCanvas();
    } catch {
        return buildFailImage(CanvasFinal, size, width, height);
    }

    const fontProps = {
        fontWeight: 800,
        fontFamily: 'Keyforge',
        textAlign: 'left',
        fillStyle: 'black',
        fontSize: 20
    };

    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!deck.houses) {
        return buildFailImage(CanvasFinal, size, width, height);
    }

    const houseData = {
        size: 35,
        0: { x: 55, y: 124 },
        1: { x: 55, y: 502 },
        2: { x: 310, y: 219 }
    };
    const cardData = {
        size: 20,
        start: { x: 54, y: 165 }
    };
    const qrCode = await QRCode.toCanvas(
        null,
        `https://www.keyforgegame.com/${deck.uuid ? 'deck-details/' + deck.uuid : ''}`,
        { margin: 0 }
    );
    const QRCodeIcon = new fabric.Image(qrCode, imgOptions);
    const expansion = SetIcons[deck.expansion];
    const Rarities = {
        Common: CommonIcon,
        Uncommon: UncommonIcon,
        Rare: RareIcon,
        Special: SpecialIcon
    };

    QRCodeIcon.set({ left: 332, top: 612 }).scaleToWidth(150);
    expansion.set({ left: 232, top: 92 }).scaleToWidth(20);
    TCOIcon.set({ left: 505, top: 769, angle: -90 }).scaleToWidth(30);
    canvas.add(DeckListIcon).add(QRCodeIcon).add(expansion).add(TCOIcon);

    let name;
    try {
        name = getCircularText(deck.name, width, height, 1800);
    } catch (err) {
        name = false;
    }
    if (name) {
        name.set({ top: 35 });
        canvas.add(name);
    }

    for (const [index, house] of deck.houses.sort().entries()) {
        const houseImage = HouseIcons[house];
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
    let cardList = [];

    for (const { count, card } of deck.cards) {
        if (!card) {
            continue;
        }

        for (let i = 0; i < count; i++) {
            cardList.push({
                ...card,
                is_maverick: !!card.maverick,
                is_anomaly: !!card.anomaly,
                enhancements: card.enhancements,
                rarity:
                    card.rarity === 'FIXED' || card.rarity === 'Variant' ? 'Special' : card.rarity
            });
        }
    }
    cardList
        .sort((a, b) => +a.number - +b.number)
        .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
        .sort((a, b) => deck.houses.sort().indexOf(a.house) - deck.houses.sort().indexOf(b.house));
    for (const [index, card] of cardList.entries()) {
        let x = cardData.start.x,
            y = cardData.start.y + index * 28;
        const name = card.locale && card.locale[language] ? card.locale[language].name : card.name;
        if (index > 11) {
            y = y + 45;
        }

        if (index > 20) {
            x = x + 255;
            y = cardData.start.y + (index - 22.1) * 28;
        }

        if (index > 23) {
            y = y + 44;
        }

        const rarity = new fabric.Image(Rarities[card.rarity].getElement(), imgOptions);
        rarity
            .set({ left: x, top: y, shadow: new fabric.Shadow(shadowProps) })
            .scaleToWidth(cardData.size);

        const number = new fabric.Text(card.number.toString(), fontProps).set({
            left: x + 22,
            top: y
        });

        const title = new fabric.Text(name, {
            ...fontProps,
            fontWeight: 300,
            fill: card.enhancements ? '#0081ad' : 'black'
        }).set({ left: x + 60, top: y });
        canvas.add(number).add(title).add(rarity);

        let iconX = x + title.width + number.width + 35;

        if (card.is_maverick) {
            const maverickImage = new fabric.Image(MaverickIcon.getElement(), imgOptions);
            maverickImage
                .set({ left: iconX, top: y, shadow: new fabric.Shadow(shadowProps) })
                .scaleToHeight(cardData.size);
            canvas.add(maverickImage);
            iconX = iconX + 20;
        }

        if (card.is_anomaly) {
            const anomalyImage = new fabric.Image(AnomalyIcon.getElement(), imgOptions);
            anomalyImage
                .set({ left: iconX, top: y, shadow: new fabric.Shadow(shadowProps) })
                .scaleToHeight(cardData.size);
            canvas.add(anomalyImage);
        }
        canvas.renderAll();
    }

    canvas.renderAll();

    return resizeCanvas(CanvasFinal, canvas, size, width, height);
};

/**
 * @param CanvasFinal
 * @param {import('./Components/Decks/DeckList').Deck} deck
 * @param size
 * @param showDeckName
 */
export const buildCardBack = async (CanvasFinal, deck, size, showDeckName) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const width = 300;
    const height = 420;

    let canvas;
    try {
        canvas = new fabric.StaticCanvas();
    } catch {
        return buildFailImage(CanvasFinal, size, width, height);
    }
    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!deck.houses) {
        return buildFailImage(CanvasFinal, size, width, height);
    }

    let number =
        (deck.uuid
            .replace(/[\D]/g, '')
            .split()
            .reduce((a, b) => a + +b, 0) %
            7) +
        1;

    const cardback = IdBackBlanksIcons[number];
    const house1 = IdBackHouseIcons[deck.houses[0]];
    const house2 = IdBackHouseIcons[deck.houses[1]];
    const house3 = IdBackHouseIcons[deck.houses[2]];

    cardback.scaleToWidth(300);
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

    canvas.renderAll();

    return resizeCanvas(CanvasFinal, canvas, size, width, height);
};

/**
 * @param CanvasFinal
 * @param maverick
 * @param anomaly
 * @param enhancements
 * @param image
 * @param url
 * @param size
 * @param halfpint
 * @param modifiedPower
 * @param tokens
 * @param card
 */
export const buildCard = async (
    CanvasFinal,
    {
        maverick,
        anomaly,
        enhancements,
        image,
        url,
        size,
        halfpint,
        modifiedPower,
        tokens = {},
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

    if (!DeckCards[halfpint ? 'halfpints' : 'cards'][image]) {
        DeckCards[halfpint ? 'halfpints' : 'cards'][image] = await loadImage(url);
    }
    const width = 300;
    const height = halfpint ? 262.5 : 420;

    let canvas;
    try {
        canvas = new fabric.StaticCanvas();
    } catch {
        return buildFailImage(CanvasFinal, size, width, height);
    }
    canvas.setWidth(width);
    canvas.setHeight(height);
    DeckCards[halfpint ? 'halfpints' : 'cards'][image].scaleToWidth(width);
    canvas.add(DeckCards[halfpint ? 'halfpints' : 'cards'][image]);
    const amber = card.cardPrintedAmber ? card.cardPrintedAmber : card.amber;
    const bonusIcons = amber > 0 || (enhancements && enhancements.length > 0);

    //house overlay
    if (maverick || anomaly) {
        let house;
        if (maverick) {
            if (!MaverickCornerImage) {
                MaverickCornerImage = await loadImage(Constants.MaverickCornerImage);
            }
            MaverickCornerImage.set({ left: 210 });
            canvas.add(MaverickCornerImage);
            house = maverick;
        } else {
            house = anomaly;
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
        const baseImage = new fabric.Image(EnhancementBaseImages[enhancements.length].getElement());
        let top = 59 + (amber ? amber * 30 : 0);

        if (['deusillus2', 'ultra-gravitron2', 'niffle-kong2'].some((x) => x === card.id)) {
            baseImage.set({ left: width - top, top: 14, angle: 90 });
        } else {
            baseImage.set({ left: 14, top });
        }

        canvas.add(baseImage);

        for (const [index, pip] of enhancements.entries()) {
            const pipImage = new fabric.Image(EnhancementPipImages[pip].getElement());

            if (['deusillus2', 'ultra-gravitron2', 'niffle-kong2'].some((x) => x === card.id)) {
                pipImage.set({ left: width - top - 8 - index * 31, top: 21, angle: 90 });
            } else {
                pipImage.set({ left: 21, top: top + 10 + index * 31 });
            }

            canvas.add(pipImage);
        }
    }
    if (card.location === 'play area') {
        //dynamic power overlay
        let totalPower = modifiedPower - (tokens.power ? tokens.power : 0);
        if (modifiedPower && totalPower !== card.printedPower) {
            Tokens.ModifiedPower.scaleToWidth(60);
            Tokens.ModifiedPower.set({ left: 10, top: 220 - (halfpint ? 25 : 0) });
            canvas.add(Tokens.ModifiedPower);
            const powerText = new fabric.Text(totalPower.toString(), tokenFontProps);
            powerText.set({
                left: 40,
                top: 250 - (halfpint ? 25 : 0),
                shadow: new fabric.Shadow(shadowProps)
            });
            canvas.add(powerText);
        }

        //armor overlay
        if (tokens.armor || card.printedArmor) {
            Tokens.armor.scaleToWidth(60);
            Tokens.armor.set({ left: 230, top: 220 - (halfpint ? 25 : 0) });
            canvas.add(Tokens.armor);
            const armorText = new fabric.Text(
                tokens.armor ? tokens.armor.toString() : '0',
                tokenFontProps
            );
            armorText.set({
                left: 260,
                top: 250 - (halfpint ? 25 : 0),
                shadow: new fabric.Shadow(shadowProps)
            });
            canvas.add(armorText);
        }
        //tokens
        const printTokens = getCountersForCard({ ...card, tokens });
        if (tokens) {
            for (const [index, { name, count, fade, showValue }] of printTokens.entries()) {
                if (!Tokens[name]) {
                    Tokens[name] = await loadImage(require(`./assets/img/${name}.png`));
                }

                const TokenImage = new fabric.Image(Tokens[name].getElement());

                TokenImage.set({ originX: 'center', originY: 'center', opacity: fade ? 0.6 : 1 });
                TokenImage.scaleToWidth(80);
                let top, left;
                if (Object.keys(printTokens).length <= 2) {
                    top = (index + 1) * 80;
                    left = 150;
                } else {
                    top = (Math.floor(index / 3) + 1) * 85;
                    left = ((index % 3) + 1) * 75;
                }
                TokenImage.set({ top, left });
                canvas.add(TokenImage);
                if (showValue) {
                    const TokenText = new fabric.Text(count.toString(), tokenFontProps);
                    TokenText.set({
                        top,
                        left: left + (name === 'power' ? 4 : -1),
                        shadow: new fabric.Shadow(shadowProps)
                    });
                    canvas.add(TokenText);
                }
            }
        }
    }
    canvas.renderAll();

    return resizeCanvas(CanvasFinal, canvas, size, width, height);
};

const buildFailImage = (CanvasFinal, size, width, height) => {
    const scale = size ? (defaultCardWidth * getCardSizeMultiplier(size)) / width : 1;
    const defaultCardImage = new fabric.Image(DefaultCard.getElement(), imgOptions);
    defaultCardImage.resizeFilter = new fabric.Image.filters.Resize({
        resizeType: 'lanczos',
        lanczosLobes: 3,
        scaleX: scale,
        scaleY: scale
    });
    defaultCardImage.applyFilters();
    defaultCardImage.scaleToWidth(width);
    CanvasFinal.add(defaultCardImage);
    CanvasFinal.renderAll();
    return resizeCanvas(CanvasFinal, null, size, width, height);
};

const resizeCanvas = (CanvasFinal, canvas, size, width, height) => {
    CanvasFinal.renderOnAddRemove = false;
    CanvasFinal.selection = false;
    const scale = size ? (defaultCardWidth * getCardSizeMultiplier(size)) / width : 1;

    if (canvas) {
        const finalImage = new fabric.Image(canvas.getElement(), imgOptions);
        finalImage.filters.push(
            new fabric.Image.filters.Resize({
                resizeType: 'lanczos',
                lanczosLobes: 3,
                scaleX: scale,
                scaleY: scale
            })
        );
        finalImage.applyFilters();
        finalImage.scaleToWidth(width);
        CanvasFinal.add(finalImage);
    }

    if (size) {
        CanvasFinal.setZoom(scale);
    }

    CanvasFinal.setWidth(width * CanvasFinal.getZoom());
    CanvasFinal.setHeight(height * CanvasFinal.getZoom());

    CanvasFinal.renderAll();
    return CanvasFinal;
};

const getCardSizeMultiplier = (size) => {
    switch (size) {
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
    const singleValueCounters = ['ward', 'enrage', 'doom'];
    const order = [
        'amber',
        'damage',
        'power',
        'ward',
        'enrage',
        'stun',
        'disruption',
        'doom',
        'fuse',
        'glory',
        'growth',
        'scheme',
        'warrant'
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

    if (card.stunned) {
        counters.push({ name: 'stun', count: 1, showValue: false });
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
