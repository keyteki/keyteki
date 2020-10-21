import { fabric } from 'fabric';
import QRCode from 'qrcode';

import { Constants } from './constants';

const EnhancementBaseImages = {};
const HouseIcons = {};
const IdBackHouseIcons = {};
const IdBackBlanksIcons = {};
const SetIcons = {};
const DeckCards = {};
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
let cacheLoaded = false;
const imgOptions = {
    selectable: false,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
    noScaleCache: false,
    objectCaching: false
};
const defaultCardWidth = 65;
const defaultCardHeight = 91;

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
                    image.resizeFilter = new fabric.Image.filters.Resize({
                        resizeType: 'lanczos',
                        lanczosLobes: 3
                    });

                    resolve(image);
                }
            },
            imgOptions
        );
    });
};

async function cacheImages() {
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
    MaverickIcon = await loadImage(require('./assets/img/idbacks/Maverick.png'));
    AnomalyIcon = await loadImage(require('./assets/img/idbacks/Anomaly.png'));
    DefaultCard = await loadImage(Constants.DefaultCard);
    cacheLoaded = true;
}

export const buildDeckList = async (canvas, deck, language, translate, size) => {
    if (!cacheLoaded) {
        await cacheImages();
    }

    size = getCardSizeMultiplier(size);

    const width = size ? defaultCardWidth * size : 600;
    const height = size ? defaultCardHeight * size : 840;

    canvas.renderOnAddRemove = false;
    canvas.selection = false;
    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!deck.houses) {
        DefaultCard.scaleToWidth(width);
        canvas.add(DefaultCard);
        canvas.renderAll();
        return canvas;
    }

    const order = ['action', 'artifact', 'creature', 'upgrade'];

    const fontProps = {
        fontWeight: 600,
        fontFamily: 'Keyforge',
        textAlign: 'left',
        fontSize: 0.0238 * height,
        enableRetinaScaling: true,
        objectCaching: false,
        noScaleCache: false,
        selectable: false,
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false
    };
    const shadowProps = {
        color: 'DarkSlateGray',
        offsetX: 5,
        offsetY: 5
    };

    const houseData = {
        size: 0.1 * width,
        0: { x: 0.093 * width, y: 0.145 * height },
        1: { x: 0.093 * width, y: 0.595 * height },
        2: { x: 0.516 * width, y: 0.255 * height }
    };
    const cardData = {
        size: 0.0238 * height,
        start: { x: 0.09 * width, y: 0.196 * height }
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
    DeckListIcon.scaleToWidth(width);
    QRCodeIcon.set({ left: 0.56 * width, top: 0.735 * height }).scaleToWidth(0.24 * width);
    expansion.set({ left: 0.39 * width, top: 0.109 * height }).scaleToWidth(0.033 * width);
    TCOIcon.set({ left: 0.833 * width, top: 0.916 * height, angle: -90 }).scaleToWidth(
        0.066 * width
    );
    canvas.add(DeckListIcon).add(QRCodeIcon).add(expansion).add(TCOIcon);

    let name;
    try {
        name = getCircularText(deck.name, width, height, width * 2.75);
    } catch (err) {
        name = false;
    }
    if (name) {
        name.set({ top: 0.037 * height - (size ? height / 5.3 / size : 0) });
        canvas.add(name);
    }

    for (const [index, house] of deck.houses.sort().entries()) {
        const houseImage = HouseIcons[house];
        houseImage
            .set({ left: houseData[index].x, top: houseData[index].y })
            .scaleToWidth(0.05 * width)
            .scaleToHeight(0.05 * width)
            .setShadow({ color: 'gray', offsetX: 5, offsetY: 5, blur: 1 });
        const houseText = new fabric.Text(
            translate(house).replace(/^\w/, (c) => c.toUpperCase()),
            {
                ...fontProps,
                fontFamily: 'Keyforge',
                textAlign: 'left',
                fontSize: 0.03 * height
            }
        ).set({
            left: houseData[index].x + 0.058 * width,
            top: houseData[index].y + 0.005 * height
        });
        canvas.add(houseText).add(houseImage);
    }
    let cardList = [];

    for (const { count, card } of deck.cards) {
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
            y = cardData.start.y + index * 0.033 * height;
        const name = card.locale && card.locale[language] ? card.locale[language].name : card.name;
        if (index > 11) {
            y = y + 0.054 * height;
        }

        if (index > 20) {
            x = x + 0.4166 * width;
            y = cardData.start.y + (index - 22.1) * 0.033 * height;
        }

        if (index > 23) {
            y = y + 0.052 * height;
        }
        if (Rarities[card.rarity]) {
            const rarity = new fabric.Image(Rarities[card.rarity].getElement(), imgOptions);
            rarity.set({ left: x, top: y }).scaleToWidth(cardData.size).setShadow(shadowProps);
            canvas.add(rarity);
        }

        const number = new fabric.Text(card.number.toString(), fontProps).set({
            left: x + 0.036 * width,
            top: y
        });

        const title = new fabric.Text(name, {
            ...fontProps,
            fontWeight: 200,
            fill: card.enhancements ? '#0081ad' : 'black'
        }).set({ left: x + 0.1 * width, top: y });
        canvas.add(number).add(title);

        let iconX = x + title.width + number.width + 0.0583 * width;

        if (card.is_maverick) {
            const maverickImage = new fabric.Image(MaverickIcon.getElement(), imgOptions);
            maverickImage
                .set({ left: iconX, top: y })
                .setShadow(shadowProps)
                .scaleToHeight(cardData.size);
            canvas.add(maverickImage);
            iconX = iconX + 0.033 * width;
        }

        if (card.is_anomaly) {
            const anomalyImage = new fabric.Image(AnomalyIcon.getElement(), imgOptions);
            anomalyImage
                .set({ left: iconX, top: y })
                .setShadow(shadowProps)
                .scaleToHeight(cardData.size);
            canvas.add(anomalyImage);
        }
        canvas.renderAll();
    }
    canvas.renderAll();
    return canvas;
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

    size = getCardSizeMultiplier(size);

    const width = size ? defaultCardWidth * size : 300;
    const height = size ? defaultCardHeight * size : 420;

    canvas.renderOnAddRemove = false;
    canvas.selection = false;
    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!deck.houses) {
        DefaultCard.scaleToWidth(width);
        canvas.add(DefaultCard);
        canvas.renderAll();
        return canvas;
    }

    let number = btoa(deck.uuid)
        .replace(/[\D+089]/g, '')
        .slice(-1);

    if (!number) {
        number = 1;
    }

    const cardback = IdBackBlanksIcons[number];
    const house1 = IdBackHouseIcons[deck.houses[0]];
    const house2 = IdBackHouseIcons[deck.houses[1]];
    const house3 = IdBackHouseIcons[deck.houses[2]];

    if (!cardback || !house1 || !house2 || !house3) {
        DefaultCard.scaleToWidth(width);
        canvas.add(DefaultCard);
        canvas.renderAll();
        return canvas;
    }

    cardback.scaleToWidth(width);
    house1.scaleToWidth(0.26 * width);
    house2.scaleToWidth(0.26 * width);
    house3.scaleToWidth(0.26 * width);
    house1.set({ left: 0.075 * width, top: 0.08 * height });
    house2.set({ left: 0.375 * width, top: 0.023 * height });
    house3.set({ left: 0.675 * width, top: 0.08 * height });
    canvas.add(cardback);
    canvas.add(house1);
    canvas.add(house2);
    canvas.add(house3);

    if (showDeckName) {
        let text;
        try {
            text = getCircularText(deck.name, width, height, 4 * width);
        } catch (err) {
            text = undefined;
        }
        if (text) {
            text.set({ top: 0.82 * height - (size ? height / 6.5 / size : 0) });
            canvas.add(text);
        }
    }

    canvas.renderAll();
    return canvas;
};

/**
 * @param canvas
 * @param maverick
 * @param anomaly
 * @param enhancements
 * @param image
 * @param url
 * @param size
 * @param card
 */
export const buildCard = async (
    canvas,
    { maverick, anomaly, enhancements, image, url, size, ...card }
) => {
    if (!cacheLoaded) {
        await cacheImages();
    }

    size = getCardSizeMultiplier(size);
    const width = size ? defaultCardWidth * size : 300;
    const height = size ? defaultCardHeight * size : 420;

    canvas.renderOnAddRemove = false;
    canvas.selection = false;
    canvas.setWidth(width);
    canvas.setHeight(height);

    if (!DeckCards[image]) {
        DeckCards[image] = await loadImage(url);
    }

    DeckCards[image].scaleToWidth(width);
    canvas.add(DeckCards[image]);
    const amber = card.cardPrintedAmber ? card.cardPrintedAmber : card.amber;
    const bonusIcons = amber > 0 || (enhancements && enhancements.length > 0);

    if (maverick || anomaly) {
        let house;
        if (maverick) {
            if (!MaverickCornerImage) {
                MaverickCornerImage = await loadImage(Constants.MaverickCornerImage);
            }
            MaverickCornerImage.scaleToWidth(0.375 * width);
            MaverickCornerImage.set({ left: 0.65 * width, top: -height * 0.01 });
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
            MaverickHouseAmberImages[house].scaleToWidth(0.375 * width);
            canvas.add(MaverickHouseAmberImages[house]);
        } else {
            if (!MaverickHouseImages[house]) {
                MaverickHouseImages[house] = await loadImage(Constants.MaverickHouseImages[house]);
            }
            MaverickHouseImages[house].scaleToWidth(0.375 * width);
            canvas.add(MaverickHouseImages[house]);
        }
    }
    if (enhancements && enhancements.length > 0 && enhancements[0] !== '') {
        const baseImage = new fabric.Image(
            EnhancementBaseImages[enhancements.length].getElement(),
            imgOptions
        );
        let top = height * 0.18 + (amber ? amber * height * 0.04 : 0);

        if (['deusillus2', 'ultra-gravitron2', 'niffle-kong2'].some((x) => x === card.id)) {
            baseImage.set({ left: width - top, top: 0.04 * height, angle: 90 });
        } else {
            baseImage.set({ left: width * 0.055, top });
        }

        baseImage.scaleToWidth(width * 0.13);
        canvas.add(baseImage);

        for (const [index, pip] of enhancements.entries()) {
            const pipImage = new fabric.Image(EnhancementPipImages[pip].getElement(), imgOptions);
            pipImage.scaleToWidth(width * 0.13);
            if (['deusillus2', 'ultra-gravitron2', 'niffle-kong2'].some((x) => x === card.id)) {
                pipImage.set({
                    left: width - top - width * 0.01 - index * width * 0.13,
                    top: height * 0.055,
                    angle: 90
                });
            } else {
                pipImage.set({
                    left: width * 0.071,
                    top: top + height * 0.03 + index * height * 0.1
                });
            }

            canvas.add(pipImage);
        }
    }
    canvas.renderAll();

    return canvas;
};

const getCardSizeMultiplier = (size) => {
    if (!size) {
        return;
    }
    switch (size) {
        case 'small':
            return 0.6;
        case 'large':
            return 1.4;
        case 'x-large':
            return 2;
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
    const final = new fabric.Image(canvas, imgOptions);
    final.resizeFilter = new fabric.Image.filters.Resize({
        resizeType: 'lanczos',
        lanczosLobes: 3
    });

    return final;
};
