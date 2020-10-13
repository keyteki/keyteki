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

export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, (image) => {
            if (!image.getElement()) {
                reject();
            } else {
                if (image.width === 0) {
                    return reject();
                }

                resolve(image);
            }
        });
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

export const buildDeckList = async (canvas, deck, language, translate) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    canvas.setWidth(300);
    canvas.setHeight(420);

    if (!deck.houses) {
        DefaultCard.scaleToWidth(300);
        canvas.add(DefaultCard);
        canvas.renderAll();
        return canvas;
    }

    const order = ['action', 'artifact', 'creature', 'upgrade'];

    const fontProps = {
        fontWeight: 600,
        fontFamily: 'Keyforge',
        textAlign: 'left',
        fontSize: 10,
        enableRetinaScaling: true,
        objectCaching: false,
        noScaleCache: false
    };
    const shadowProps = {
        color: 'DarkSlateGray',
        offsetX: 5,
        offsetY: 5
    };

    const houseData = {
        size: 30,
        0: { x: 28, y: 62 },
        1: { x: 28, y: 251 },
        2: { x: 155, y: 109.5 }
    };
    const cardData = {
        size: 10,
        start: { x: 27, y: 82.5 }
    };
    const qrCode = await QRCode.toCanvas(
        null,
        `https://www.keyforgegame.com/${deck.uuid ? 'deck-details/' + deck.uuid : ''}`,
        { margin: 0 }
    );
    const QRCodeIcon = new fabric.Image(qrCode, {
        objectCaching: false,
        noScaleCache: false
    });
    const expansion = SetIcons[deck.expansion];
    const Rarities = {
        Common: CommonIcon,
        Uncommon: UncommonIcon,
        Rare: RareIcon,
        Special: SpecialIcon
    };
    DeckListIcon.scaleToWidth(300);
    QRCodeIcon.set({ left: 168, top: 308 }).scaleToWidth(70);
    expansion.set({ left: 116, top: 46 }).scaleToWidth(10);
    TCOIcon.set({ left: 250, top: 385, angle: -90 }).scaleToWidth(20);
    canvas.add(DeckListIcon).add(QRCodeIcon).add(expansion).add(TCOIcon);

    let name;
    try {
        name = getCircularText(deck.name, 850, 15);
    } catch (err) {
        name = false;
    }
    if (name) {
        canvas.add(name);
    }

    for (const [index, house] of deck.houses.sort().entries()) {
        const houseImage = HouseIcons[house];
        houseImage
            .set({ left: houseData[index].x, top: houseData[index].y })
            .scaleToWidth(15)
            .scaleToHeight(15)
            .setShadow({ color: 'gray', offsetX: 5, offsetY: 5, blur: 1 });
        const houseText = new fabric.Text(
            translate(house).replace(/^\w/, (c) => c.toUpperCase()),
            {
                ...fontProps,
                fontFamily: 'Keyforge',
                textAlign: 'left',
                fontSize: 12.5
            }
        ).set({ left: houseData[index].x + 17.5, top: houseData[index].y + 2.5 });
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
            y = cardData.start.y + index * 14;
        const name = card.locale && card.locale[language] ? card.locale[language].name : card.name;
        if (index > 11) {
            y = y + 22.5;
        }

        if (index > 20) {
            x = x + 125.5;
            y = cardData.start.y + (index - 22.1) * 14;
        }

        if (index > 23) {
            y = y + 22;
        }
        if (Rarities[card.rarity]) {
            const rarity = new fabric.Image(Rarities[card.rarity].getElement());
            rarity.set({ left: x, top: y }).scaleToWidth(cardData.size).setShadow(shadowProps);
            canvas.add(rarity);
        }

        const number = new fabric.Text(card.number.toString(), fontProps).set({
            left: x + 11,
            top: y
        });

        const title = new fabric.Text(name, {
            ...fontProps,
            fontWeight: 200,
            fill: card.enhancements ? '#0081ad' : 'black'
        }).set({ left: x + 30, top: y });
        canvas.add(number).add(title);

        let iconX = x + title.width + number.width + 17.5;

        if (card.is_maverick) {
            const maverickImage = new fabric.Image(MaverickIcon.getElement(), {
                objectCaching: false,
                noScaleCache: false
            });
            maverickImage
                .set({ left: iconX, top: y })
                .setShadow(shadowProps)
                .scaleToHeight(cardData.size);
            canvas.add(maverickImage);
            iconX = iconX + 10;
        }

        if (card.is_anomaly) {
            const anomalyImage = new fabric.Image(AnomalyIcon.getElement(), {
                objectCaching: false,
                noScaleCache: false
            });
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
 * @param showDeckName
 */
export const buildCardBack = async (canvas, deck, showDeckName) => {
    if (!cacheLoaded) {
        await cacheImages();
    }

    canvas.setWidth(300);
    canvas.setHeight(420);

    if (!deck.houses) {
        DefaultCard.scaleToWidth(300);
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
        DefaultCard.scaleToWidth(300);
        canvas.add(DefaultCard);
        canvas.renderAll();
        return canvas;
    }

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
            text = getCircularText(deck.name, 1250, 690);
        } catch (err) {
            text = undefined;
        }
        if (text) {
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
 * @param card
 */
export const buildCard = async (
    canvas,
    { maverick, anomaly, enhancements, image, url, ...card }
) => {
    if (!cacheLoaded) {
        await cacheImages();
    }
    const width = 300;
    const height = 420;

    canvas.setWidth(width);
    canvas.setHeight(height);
    if (!DeckCards[image]) {
        DeckCards[image] = await loadImage(url);
    }
    canvas.add(DeckCards[image]);
    const amber = card.cardPrintedAmber ? card.cardPrintedAmber : card.amber;
    const bonusIcons = amber > 0 || (enhancements && enhancements.length > 0);

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
                pipImage.set({ left: width - top - 10 - index * 31, top: 21, angle: 90 });
            } else {
                pipImage.set({ left: 21, top: top + 10 + index * 31 });
            }

            canvas.add(pipImage);
        }
    }
    canvas.renderAll();
    return canvas;
};

const getCurvedFontSize = (length) => {
    const size = (15 / length) * 30;
    if (size > 15) {
        return 20;
    }

    return size;
};

const getCircularText = (
    text = '',
    diameter,
    yOffset = 0,
    fontSize = getCurvedFontSize(text.length)
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

    canvas.width = 300;
    canvas.height = 420;
    ctx.font = `${fontSize}px Keyforge`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'rgb(32,32,32)';
    ctx.lineWidth = 1;

    text = text.split('').reverse().join('');

    ctx.translate(150, Math.max((diameter + yOffset) / 2, 210 + yOffset)); // Move to center
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
    return new fabric.Image(canvas, {
        objectCaching: false,
        noScaleCache: false
    });
};
