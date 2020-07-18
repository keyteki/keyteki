import { fabric } from 'fabric';
import QRCode from 'qrcode';

import { Constants } from './constants';
import DefaultCard from './assets/img/idbacks/identity.jpg';

const HouseIcons = {};
const IdBackHouseIcons = {};
const IdBackBlanks = {};
const SetIcons = {};
let AnomalyIcon;
let CommonIcon;
let DeckListIcon;
let MaverickIcon;
let RareIcon;
let SpecialIcon;
let TCOIcon;
let UncommonIcon;

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

for (let house of Constants.Houses) {
    loadImage(require(`./assets/img/house/${house}.png`)).then((image) => {
        HouseIcons[house] = image;
    });
}

for (let house of Constants.Houses) {
    loadImage(require(`./assets/img/idbacks/idback_houses/${house}.png`)).then((image) => {
        IdBackHouseIcons[house] = image;
    });
}

for (let x = 1; x < 8; x++) {
    loadImage(require(`./assets/img/idbacks/idback_blanks/archon_${x}.png`)).then((image) => {
        IdBackBlanks[x] = image;
    });
}

for (let [key, path] of Object.entries(Constants.SetIconPaths)) {
    loadImage(path).then((image) => {
        SetIcons[key] = image;
    });
}

loadImage(require('./assets/img/idbacks/tco.png')).then((image) => {
    TCOIcon = image;
});

loadImage(require('./assets/img/idbacks/decklist.png')).then((image) => {
    DeckListIcon = image;
});

loadImage(require('./assets/img/idbacks/Common.png')).then((image) => {
    CommonIcon = image;
});

loadImage(require('./assets/img/idbacks/Rare.png')).then((image) => {
    RareIcon = image;
});

loadImage(require('./assets/img/idbacks/Special.png')).then((image) => {
    SpecialIcon = image;
});

loadImage(require('./assets/img/idbacks/Uncommon.png')).then((image) => {
    UncommonIcon = image;
});

loadImage(require('./assets/img/idbacks/Maverick.png')).then((image) => {
    MaverickIcon = image;
});

loadImage(require('./assets/img/idbacks/Anomaly.png')).then((image) => {
    AnomalyIcon = image;
});

export const buildDeckList = async (deck, language, translate, allCards) => {
    if (!deck.houses) {
        return DefaultCard;
    }

    if (!deck.cards || 0 >= deck.cards.length) {
        try {
            return await buildArchon(deck, language, translate);
        } catch {
            return DefaultCard;
        }
    }

    let canvas;
    const order = ['action', 'artifact', 'creature', 'upgrade'];

    try {
        canvas = new fabric.Canvas('decklist');
    } catch (err) {
        return DefaultCard;
    }

    canvas.setDimensions({ width: 600, height: 840 });
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
    const qrCode = await QRCode.toDataURL(
        `https://www.keyforgegame.com/${deck.uuid ? 'deck-details/' + deck.uuid : ''}`,
        { margin: 0 }
    );
    const QRCodeIcon = await loadImage(qrCode);
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
    canvas
        .add(DeckListIcon)
        .add(QRCodeIcon)
        .add(expansion)
        .add(getCircularText(deck.name, 1600, 65))
        .add(TCOIcon);

    for (const [index, house] of deck.houses.sort().entries()) {
        const houseImage = HouseIcons[house];
        houseImage
            .set({ left: houseData[index].x, top: houseData[index].y })
            .scaleToWidth(30)
            .scaleToHeight(30)
            .setShadow({ color: 'gray', offsetX: 10, offsetY: 10, blur: 3 });
        const houseText = new fabric.Text(
            translate(house).replace(/^\w/, (c) => c.toUpperCase()),
            {
                fontWeight: 800,
                fontFamily: 'Keyforge',
                textAlign: 'left',
                stroke: 'black',
                fontSize: 25
            }
        ).set({ left: houseData[index].x + 35, top: houseData[index].y + 5 });
        canvas.add(houseText).add(houseImage);
    }
    let cardList = [];

    for (const card of deck.cards) {
        if (card.count) {
            for (let i = 0; i < card.count; i++) {
                cardList.push({
                    ...allCards[card.card.id],
                    is_maverick: !!card.card.maverick,
                    is_anomaly: !!card.card.anomaly,
                    enhancements: card.card.enhancements,
                    house: card.card.house
                });
            }
        } else {
            cardList.push({
                ...allCards[card.id],
                is_maverick: !!card.maverick,
                is_anomaly: !!card.anomaly,
                enhancements: card.enhancements,
                house: card.house
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

        const fontProps = {
            fontWeight: 800,
            fontFamily: 'Keyforge',
            textAlign: 'left',
            fillStyle: 'black',
            fontSize: 20
        };
        const rarity = new fabric.Image(
            Rarities[
                card.rarity === 'FIXED' || card.rarity === 'Variant' ? 'Special' : card.rarity
            ].getElement()
        );
        if (rarity) {
            rarity
                .set({ left: x, top: y })
                .scaleToWidth(cardData.size)
                .setShadow(
                    new fabric.Shadow({
                        color: 'gray',
                        offsetX: 10,
                        offsetY: 10,
                        blur: 3
                    })
                );
        }

        const number = new fabric.Text(card.number.toString(), fontProps).set({
            left: x + 22,
            top: y
        });
        if (card.enhancements) {
            fontProps.fill = '#0081ad';
        }

        const title = new fabric.Text(name, {
            ...fontProps,
            fontWeight: 300
        }).set({ left: x + 60, top: y });
        canvas.add(number).add(title).add(rarity);

        let iconX = x + title.width + number.width + 35;

        if (card.is_maverick) {
            const maverickImage = new fabric.Image(MaverickIcon.getElement());
            maverickImage
                .set({ left: iconX, top: y })
                .setShadow(
                    new fabric.Shadow({
                        color: 'gray',
                        offsetX: 10,
                        offsetY: 10,
                        blur: 5
                    })
                )
                .scaleToHeight(cardData.size);
            canvas.add(maverickImage);
            iconX = iconX + 20;
        }

        if (card.is_anomaly) {
            const anomalyImage = new fabric.Image(AnomalyIcon.getElement());
            anomalyImage
                .set({ left: iconX, top: y })
                .setShadow(
                    new fabric.Shadow({
                        color: 'gray',
                        offsetX: 10,
                        offsetY: 10,
                        blur: 5
                    })
                )
                .scaleToHeight(cardData.size);
            canvas.add(anomalyImage);
        }
        canvas.renderAll();
    }
    return canvas.toDataURL({ format: 'jpeg', quality: 1 });
};

/**
 * @param {import('./Components/Decks/DeckList').Deck} deck
 * @param {string} language
 * @param {function} translate
 */
export const buildArchon = async (deck, language, translate) => {
    if (!deck.houses) {
        return DefaultCard;
    }

    let canvas;
    try {
        canvas = new fabric.Canvas('archon');
    } catch (err) {
        return DefaultCard;
    }

    canvas.setDimensions({ width: 600, height: 840 });

    const houseNames = [
        { x: 120, y: 720 },
        { x: 300, y: 770 },
        { x: 480, y: 720 }
    ];

    let number = btoa(deck.uuid)
        .replace(/[\D+089]/g, '')
        .slice(-1);

    const cardback = IdBackBlanks[number];
    let house1 = IdBackHouseIcons[deck.houses[0]];
    let house2 = IdBackHouseIcons[deck.houses[1]];
    let house3 = IdBackHouseIcons[deck.houses[2]];

    if (!cardback || !house1 || !house2 || !house3) {
        return DefaultCard;
    }

    house1.scaleToWidth(150);
    house2.scaleToWidth(150);
    house3.scaleToWidth(150);
    house1.set({ left: 45, top: 590 });
    house2.set({ left: 225, top: 640 });
    house3.set({ left: 405, top: 590 });
    canvas.add(cardback);
    canvas.add(house1);
    canvas.add(house2);
    canvas.add(house3);
    for (let [index, house] of deck.houses.entries()) {
        const name = getCircularText(
            translate(house).replace(/^\w/, (c) => c.toUpperCase()),
            1400,
            0,
            20
        );
        name.set({ originX: 'center', top: houseNames[index].y, left: houseNames[index].x });
        canvas.add(name);
    }
    canvas.add(getCircularText(deck.name, 700, 15));
    canvas.renderAll();
    return canvas.toDataURL({ format: 'jpeg', quality: 1 });
};

const getCurvedFontSize = (length) => {
    const size = (30 / length) * 30;
    if (size > 30) {
        return 40;
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

    canvas.width = 600;
    canvas.height = 800;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'grey';
    ctx.shadowColor = 'rgb(32,32,32)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;
    ctx.font = `${fontSize}px Keyforge`;

    text = text.split('').reverse().join('');

    ctx.translate(300, Math.max((diameter + yOffset) / 2, 400 + yOffset)); // Move to center
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
        ctx.fillText(text[j], 0, 0 - diameter / 2 + textHeight / 2);
        ctx.rotate((charWid / 2 / (diameter / 2 - textHeight)) * -1); // rotate half letter
    }

    return new fabric.Image(canvas, { left: 0, top: 0 });
};
