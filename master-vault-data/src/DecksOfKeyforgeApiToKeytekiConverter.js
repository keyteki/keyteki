const fs = require('fs');

const { cardIdFromTitle } = require('./cardId');
const { httpRequest, parseKeywords, sortLocales, writePack } = require('./cardData');
const { applyOverrides } = require('./overrides');

class DecksOfKeyforgeApiToKeytekiConverter {
    async convert({ pathToPackFile, language, cyclePrefix }) {
        console.log('Loading ' + language + ' cards...');

        let pack = JSON.parse(fs.readFileSync(pathToPackFile));

        this.cyclePrefix = cyclePrefix;

        let cards;
        try {
            cards = await this.getCards(pack, language);
        } catch (err) {
            console.info(err);
            return;
        }

        if (!cards) {
            return;
        }

        cards.sort((a, b) => (a.number < b.number ? -1 : 1));

        pack.cards = cards;

        applyOverrides(pack.cards);
        writePack(pathToPackFile, pack);
        console.log('Import of cards for', pack.name, 'has been completed.');
    }

    async getCards(pack, language) {
        const apiUrl = 'https://decksofkeyforge.com/api/spoilers';

        let packCardMap = pack.cards.reduce(function (map, obj) {
            map[obj.number] = obj;
            return map;
        }, {});

        let response;
        let cards = {};

        try {
            response = await httpRequest(apiUrl, { json: true });
        } catch (err) {
            console.info(err);

            return;
        }

        let generatedNumber = 900;
        let generatedNumberCards = {};
        for (let card of response) {
            if (!card.cardNumber) {
                generatedNumberCards[card.cardTitle] =
                    generatedNumberCards[card.cardTitle] || ++generatedNumber;
                card.cardNumber = generatedNumberCards[card.cardTitle];
            }

            if (
                !pack.ids.includes('' + card.expansion) ||
                cards[card.cardNumber] ||
                card.maverick
            ) {
                console.log(
                    'Ignoring card: ',
                    card.cardTitle,
                    card.expansion,
                    card.cardNumber,
                    card.maverick
                );
                continue;
            }

            if (card.reprint) {
                console.log('Ignoring reprinted card: ', card.cardTitle);
                continue;
            }

            // Fix the house of an anomaly to brobnar so that we can test them until they get a real house
            if (card.anomaly) {
                card.house = 'brobnar';
            }

            let newCard = null;

            if (language === 'en') {
                newCard = {
                    id: cardIdFromTitle(card.cardTitle),
                    name: card.cardTitle,
                    number: card.cardNumber,
                    image: card.frontImage,
                    expansion: card.expansion,
                    house: card.house.toLowerCase().replace(' ', ''),
                    keywords: parseKeywords(card.cardText),
                    traits: !card.traits ? [] : card.traits.map((trait) => trait.toLowerCase()),
                    type: card.cardType.toLowerCase(),
                    rarity: card.rarity,
                    amber: card.amber === '' ? 0 : parseInt(card.amber),
                    armor:
                        card.cardType.toLowerCase() === 'creature'
                            ? card.armorString !== ''
                                ? parseInt(card.armorString)
                                : 0
                            : null,
                    power: card.powerString === '' ? null : parseInt(card.powerString),
                    text: card.cardText,
                    locale: {
                        en: {
                            name: card.cardTitle
                        }
                    }
                };
            } else {
                // Append locale information
                newCard = packCardMap[card.cardNumber];
                if (!newCard) {
                    continue;
                }

                newCard.locale = newCard.locale || {};

                newCard.locale[language.replace('-', '')] = {
                    name: card.cardTitle
                };
            }

            newCard.locale = sortLocales(newCard.locale);

            cards[card.cardNumber] = newCard;
        }

        return Object.values(cards);
    }
}

module.exports = DecksOfKeyforgeApiToKeytekiConverter;
