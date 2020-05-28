import { fabric } from 'fabric';
import QRCode from 'qrcode';
import uuid from 'uuid';

const defaultCard = 'img/idbacks/identity.jpg';

export const buildDeckList = (deck, language, translate, AllCards) =>
    new Promise((resolve) => {
        if (!deck.houses) {
            resolve(defaultCard);
            return;
        }

        if (!deck.cards || 0 >= deck.cards.length) {
            buildArchon(deck, language)
                .then((imageUrl) => resolve(imageUrl))
                .catch(() => {
                    resolve(defaultCard);
                });
            return;
        }

        let canvas;
        try {
            canvas = new fabric.Canvas('decklist');
        } catch (err) {
            resolve(defaultCard);
        }

        canvas.setDimensions({ width: 600, height: 840 });
        const Common = loadImage('img/idbacks/Common.png');
        const Rare = loadImage('img/idbacks/Rare.png');
        const Special = loadImage('img/idbacks/Special.png');
        const Uncommon = loadImage('img/idbacks/Uncommon.png');
        const cardBack = loadImage('img/idbacks/decklist.png');
        const set = loadImage(`img/idbacks/${deck.expansion}.png`);
        const tco = loadImage('img/idbacks/tco.png');

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
        const qrCode = new Promise((qrRes) => {
            QRCode.toDataURL(
                `https://www.keyforgegame.com/${deck.uuid ? 'deck-details/' + deck.uuid : ''}`,
                { margin: 0 }
            ).then((url) => loadImage(url).then((image) => qrRes(image)));
        });
        Promise.all([cardBack, Common, Uncommon, Rare, Special, qrCode, set, tco])
            .then(([cardBack, Common, Uncommon, Rare, Special, qrCode, set, tco]) => {
                const Rarities = { Common, Uncommon, Rare, Special };
                qrCode.set({ left: 332, top: 612 }).scaleToWidth(150);
                set.set({ left: 232, top: 92 }).scaleToWidth(20);
                tco.set({ left: 505, top: 769, angle: -90 }).scaleToWidth(30);
                canvas
                    .add(cardBack)
                    .add(qrCode)
                    .add(set)
                    .add(getCircularText(deck.name, 1600, 65))
                    .add(tco);

                const houseProm = deck.houses.sort().map((house, index) => {
                    return new Promise((houseRes) => {
                        loadImage(`img/idbacks/houses/${house}.png`).then((img) => {
                            img.set({ left: houseData[index].x, top: houseData[index].y })
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
                            canvas.add(houseText).add(img);
                            houseRes();
                        });
                    });
                });
                let order = ['action', 'artifact', 'creature', 'upgrade'];
                let cardList = deck.cards
                    .map((card) => {
                        return {
                            ...AllCards[card.id],
                            is_maverick: !!card.maverick,
                            is_legacy: !!card.legacy,
                            is_anomaly: !!card.anomaly,
                            enhancements: card.enhancements,
                            house: card.house
                        };
                    })
                    .sort((a, b) => +a.number - +b.number)
                    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
                    .sort(
                        (a, b) =>
                            deck.houses.sort().indexOf(a.house) -
                            deck.houses.sort().indexOf(b.house)
                    );
                const cardProm = cardList.map((card, index) => {
                    return async (cardRes) => {
                        let x = cardData.start.x,
                            y = cardData.start.y + index * 28;
                        const name =
                            card.locale && card.locale[language]
                                ? card.locale[language].name
                                : card.name;
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
                                card.rarity === 'FIXED' || card.rarity === 'Variant'
                                    ? 'Special'
                                    : card.rarity
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
                            const maverick = await loadImage('img/idbacks/Maverick.png');
                            const maverickImage = new fabric.Image(maverick.getElement())
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
                            const anomaly = await loadImage('img/idbacks/Anomaly.png');
                            const anomalyImage = new fabric.Image(anomaly.getElement())
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

                        cardRes();
                    };
                });

                Promise.all([...houseProm, ...cardProm])
                    .then(() => resolve(canvas.toDataURL('image/jpeg')))
                    .catch(() => {
                        resolve(defaultCard);
                    });
            })
            .catch(() => {
                resolve(defaultCard);
            });
    });

/**
 * @param {import('./Components/Decks/DeckList').Deck} deck
 * @param {string} language
 */
export const buildArchon = async (deck, language) => {
    if (!deck.houses) {
        return defaultCard;
    }

    let canvas;
    try {
        canvas = new fabric.Canvas('archon');
    } catch (err) {
        return defaultCard;
    }

    canvas.setDimensions({ width: 600, height: 840 });
    let archon;
    try {
        archon = await loadImage(`/img/idbacks/archons/${imageName(deck, language)}.png`);
    } catch {
        archon = await loadImage(defaultCard);
    }

    canvas.add(archon);
    canvas.add(getCircularText(deck.name, 700, 15));

    return canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
};

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, (image) => {
            if (!image.getElement()) {
                console.info('rejecting');
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
