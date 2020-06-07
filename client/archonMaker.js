import { fabric } from 'fabric';
import QRCode from 'qrcode';
import uuid from 'uuid';

import { Constants } from './constants';

const HouseIcons = {};
const SetIcons = {};
let TCOIcon;
let CardBackIcon;
let CommonIcon;
let RareIcon;
let SpecialIcon;
let UncommonIcon;
let MaverickIcon;
let AnomalyIcon;
let DefaultCard;

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
    loadImage(require(`./assets/img/idbacks/houses/${house}.png`)).then((image) => {
        HouseIcons[house] = image;
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
    CardBackIcon = image;
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

loadImage(require('./assets/img/idbacks/identity-clean.png')).then((image) => {
    DefaultCard = image;
});

export const buildDeckList = async (deck, language, translate, allCards) => {
    if (!deck.houses) {
        return DefaultCard;
    }

    if (!deck.cards || 0 >= deck.cards.length) {
        try {
            return await buildArchon(deck, language);
        } catch {
            return DefaultCard;
        }
    }

    let canvas;
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

    const Rarities = {
        Common: CommonIcon,
        Uncommon: UncommonIcon,
        Rare: RareIcon,
        Special: SpecialIcon
    };
    QRCodeIcon.set({ left: 332, top: 612 }).scaleToWidth(150);
    SetIcons[deck.expansion].set({ left: 232, top: 92 }).scaleToWidth(20);
    TCOIcon.set({ left: 505, top: 769, angle: -90 }).scaleToWidth(30);
    canvas
        .add(CardBackIcon)
        .add(QRCodeIcon)
        .add(SetIcons[deck.expansion])
        .add(getCircularText(deck.name, 1600, 65))
        .add(TCOIcon);

    deck.houses.sort().map((house, index) => {
        HouseIcons[house]
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
        canvas.add(houseText).add(HouseIcons[house]);
    });
    let order = ['action', 'artifact', 'creature', 'upgrade'];
    let cardList = deck.cards
        .map((card) => {
            return {
                ...allCards[card.id],
                is_maverick: !!card.maverick,
                is_legacy: !!card.legacy,
                is_anomaly: !!card.anomaly,
                enhancements: card.enhancements,
                house: card.house
            };
        })
        .sort((a, b) => +a.number - +b.number)
        .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
        .sort((a, b) => deck.houses.sort().indexOf(a.house) - deck.houses.sort().indexOf(b.house));
    cardList.map((card, index) => {
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
        )
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
        canvas.add(number).add(rarity).add(title);

        let iconX = x + title.width + number.width + 35;

        if (card.is_maverick) {
            const maverickImage = new fabric.Image(MaverickIcon.getElement())
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
            const anomalyImage = new fabric.Image(AnomalyIcon.getElement())
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
    });

    return canvas.toDataURL('image/jpeg');
};

/**
 * @param {import('./Components/Decks/DeckList').Deck} deck
 * @param {string} language
 */
export const buildArchon = async (deck, language) => {
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
    let archon;
    try {
        archon = await loadImage(`/img/idbacks/archons/${imageName(deck, language)}.png`);
    } catch {
        archon = DefaultCard;
    }

    canvas.add(archon);
    canvas.add(getCircularText(deck.name, 700, 15));

    return canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
};

const imageName = (deck, language) => {
    let number = btoa(deck.uuid || uuid.v1())
        .replace(/[\D+089]/g, '')
        .slice(-1);
    return btoa([...deck.houses.sort(), language, number === '' ? 1 : number].join());
};

const getCurvedFontSize = (length) => {
    const size = (30 / length) * 30;
    if (size > 30) {
        return 40;
    }

    return size;
};

const getCircularText = (text = '', diameter, yOffset = 0) => {
    let canvas;
    try {
        canvas = fabric.util.createCanvasElement();
        canvas.id = 'archon-canvas';
    } catch (err) {
        return;
    }

    let ctx = canvas.getContext('2d');
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
    ctx.font = `${getCurvedFontSize(text.length)}px Keyforge`;

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

    let img = document.createElement('img');
    img.src = canvas.toDataURL();

    return new fabric.Image(img, { left: 0, top: 0 });
};
