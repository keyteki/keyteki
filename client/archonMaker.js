import * as Images from './assets/img';
import { createCanvas, loadImage } from 'canvas';
import QRCode from 'qrcode';

export const buildDeckList = (deck, language, translate, AllCards) => new Promise(resolve => {
    if(0 >= deck.uuid.length || 0 >= deck.houses.length) {
        resolve(Images.cardback);
        return;
    }

    if(0 >= deck.cards.length) {
        buildArchon(deck, language).then(imageUrl => resolve(imageUrl));
        return;
    }

    const canvas = createCanvas(600, 840);
    const ctx = canvas.getContext('2d');
    const cardBack = loadImage(Images.decklist);
    const Common = loadImage(Images.Common);
    const Uncommon = loadImage(Images.Uncommon);
    const Rare = loadImage(Images.Rare);
    const Special = loadImage(Images.Special);
    const maverick = loadImage(Images.Maverick);
    const legacy = loadImage(Images.Legacy);
    const anomaly = loadImage(Images.Anomaly);
    const set = loadImage(Images[`icon${deck.expansion}`]);

    const houseData = {
        size: 35,
        0: { x: 55, y: 120 },
        1: { x: 55, y: 498 },
        2: { x: 310, y: 215 }
    };
    const cardData = {
        size: 20,
        start: { x: 60, y: 185 }
    };
    const qrCode = new Promise(qrRes => {
        QRCode.toDataURL(`https://www.keyforgegame.com/${deck.uuid.length > 0 ? 'deck-details/' + deck.uuid : ''}`, { margin: 0 })
            .then(url => loadImage(url).then(image => qrRes(image)));
    });
    Promise.all([cardBack, maverick, legacy, anomaly, Common, Uncommon, Rare, Special, qrCode, set])
        .then(([cardBack, maverick, legacy, anomaly, Common, Uncommon, Rare, Special, qrCode, set]) => {
            const Rarities = { Common, Uncommon, Rare, Special };
            ctx.drawImage(cardBack, 0, 0);
            ctx.drawImage(qrCode, 332, 612, 150, 150);
            ctx.drawImage(set, 232, 92, 20, 20);

            const houseProm = deck.houses.map((house, index) => {
                return new Promise(houseRes => {
                    loadImage(Images[house]).then(img => {
                        ctx.drawImage(img, houseData[index].x, houseData[index].y, houseData.size, houseData.size);
                        ctx.fillStyle = 'black';
                        ctx.font = 'bold 25px Keyforge';
                        ctx.textAlign = 'left';
                        ctx.fillText(translate(house).toUpperCase(), houseData[index].x + 40, houseData[index].y + 28);
                        houseRes();
                    });
                });
            });
            let order = ['action', 'artifact', 'creature', 'upgrade'];
            let cardList = deck.cards.map(card => {
                return {
                    ...AllCards[card.id],
                    is_maverick: !!card.maverick,
                    is_legacy: !!card.legacy,
                    is_anomaly: !!card.anomaly,
                    house: card.house
                };
            })
                .sort((a, b) => +a.number - +b.number)
                .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
                .sort((a, b) => deck.houses.indexOf(a.house) - deck.houses.indexOf(b.house));
            const cardProm = cardList.map((card, index) => {
                return new Promise(cardRes => {
                    const title = (card.locale && card.locale[language]) ? card.locale[language].name : card.name;
                    let x = cardData.start.x,
                        y = cardData.start.y + (index * 28);
                    if(index > 11) {
                        y = y + 45;
                    }

                    if(index > 20) {
                        x = x + 245;
                        y = cardData.start.y + ((index - 22.5) * 28);
                    }

                    if(index > 23) {
                        y = y + 52;
                    }

                    ctx.drawImage((Rarities[card.rarity === 'FIXED' || card.rarity === 'Variant' ? 'Special' : card.rarity]), x, y - 19, cardData.size, cardData.size);
                    ctx.fillStyle = 'black';
                    ctx.font = 'bold 20px Keyforge';
                    ctx.textAlign = 'left';
                    ctx.fillText(card.number, x + 22, y);
                    ctx.font = '20px Keyforge';
                    ctx.fillText(title, x + 60, y);
                    if(card.is_maverick) {
                        ctx.drawImage(maverick, x + ((title.length * 6) + 100), y - 18, cardData.size, cardData.size);
                    }

                    if(card.is_legacy) {
                        ctx.drawImage(legacy, x + ((title.length * 6) + 100) + (card.is_maverick ? 20 : 0), y - 18, cardData.size, cardData.size);
                    }

                    if(card.is_anomaly) {
                        ctx.drawImage(anomaly, x + ((title.length * 6) + 100) + (card.is_maverick ? 20 : 0), y - 18, cardData.size, cardData.size);
                    }

                    cardRes();
                });
            });
            ctx.drawImage((getCircularText(deck.name, 1600, 0)), -500, 35);

            Promise.all([...houseProm, ...cardProm]).then(() => resolve(canvas.toDataURL('image/jpeg', 0.75)));
        });
});

export const buildArchon = (deck, language) => new Promise(resolve => {
    if(0 >= deck.uuid.length || 0 >= deck.houses.length) {
        resolve(Images.cardback);
        return;
    }

    const canvas = createCanvas(600, 840);
    const ctx = canvas.getContext('2d');
    loadImage(`/img/idbacks/archons/${imageName(deck, language)}.png`)
        .then(archon => {
            ctx.drawImage(archon, 0, 0);
            ctx.drawImage((getCircularText(deck.name, 700, 0)), -50, 70);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
        });
});

const imageName = (deck, language) => {
    if(deck.uuid === '') {
        return 'archon';
    }

    let number = btoa(deck.uuid)
        .replace(/[\D+089]/g, '')
        .slice(-1);
    return btoa([...deck.houses, language, number === '' ? 1 : number].join());
};

const getCurvedFontSize = (length) => {
    const size = (30 / length) * 30;
    if(size > 30) {
        return 40;
    }

    return size;
};

const getCircularText = (text = '', diameter, kerning) => {
    let canvas = createCanvas(600, 840);
    let ctx = canvas.getContext('2d');
    let textHeight = 40, startAngle = 0;

    canvas.width = diameter;
    canvas.height = diameter;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'grey';
    ctx.font = `bold ${getCurvedFontSize(text.length)}px Keyforge`;

    text = text.split('').reverse().join('');

    ctx.translate(diameter / 2, diameter / 2); // Move to center
    ctx.textBaseline = 'middle'; // Ensure we draw in exact center
    ctx.textAlign = 'center'; // Ensure we draw in exact center

    for(let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width;
        startAngle += ((charWid + (j === text.length - 1 ? 0 : kerning)) / (diameter / 2 - textHeight)) / 2;
    }

    ctx.rotate(startAngle);

    for(let j = 0; j < text.length; j++) {
        let charWid = ctx.measureText(text[j]).width; // half letter
        ctx.rotate((charWid / 2) / (diameter / 2 - textHeight) * -1);
        ctx.fillText(text[j], 0, (0 - diameter / 2 + textHeight / 2));
        ctx.rotate((charWid / 2 + kerning) / (diameter / 2 - textHeight) * -1); // rotate half letter
    }

    return canvas;
};
