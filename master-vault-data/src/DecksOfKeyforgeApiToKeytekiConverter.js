const fs = require('fs');
const request = require('request');

const ValidKeywords = [
    'elusive',
    'skirmish',
    'taunt',
    'deploy',
    'alpha',
    'omega',
    'hazardous',
    'assault',
    'poison',
    'splash-attack',
    'treachery',
    'versatile',
    'entrench'
];

function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        request(url, options, (err, res, body) => {
            if (err) {
                if (res) {
                    err.statusCode = res.statusCode;
                }

                return reject(err);
            }

            if (res.statusCode !== 200) {
                const err = new Error('Request failed');
                if (res) {
                    err.statusCode = res.statusCode;
                    err.res = res;
                }

                return reject(err);
            }

            resolve(body);
        });
    });
}

class DecksOfKeyforgeApiToKeytekiConverter {
    async convert({ pathToPackFile, language, cyclePrefix }) {
        console.log('Loading ' + language + ' cards...');

        const pack = JSON.parse(fs.readFileSync(pathToPackFile));

        this.cyclePrefix = cyclePrefix;

        let cards;
        try {
            cards = await this.getCards(pack, language);
        } catch (err) {
            console.info(err);
            return;
        }

        cards.sort((a, b) => (a.number < b.number ? -1 : 1));

        pack.cards = cards;

        fs.writeFileSync(pathToPackFile, JSON.stringify(pack, null, 4) + '\n');
        console.log('Import of cards for', pack.name, 'has been completed.');
    }

    async getCards(pack, language) {
        const apiUrl = 'https://decksofkeyforge.com/api/spoilers';

        const packCardMap = pack.cards.reduce(function (map, obj) {
            map[obj.number] = obj;
            return map;
        }, {});

        let response;
        const cards = {};

        let responseReceived = false;

        while (!responseReceived) {
            try {
                response = await httpRequest(`${apiUrl}`, { json: true });
                responseReceived = true;
            } catch (err) {
                console.info(err);

                return;
            }
        }

        let generatedNumber = 900;
        const generatedNumberCards = {};
        for (const card of response) {
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
                    id: card.cardTitle
                        .toLowerCase()
                        .replace(/[?.!",“”]/gi, '')
                        .replace(/[ '’]/gi, '-'),
                    name: card.cardTitle,
                    number: card.cardNumber,
                    image: card.frontImage,
                    expansion: card.expansion,
                    house: card.house.toLowerCase().replace(' ', ''),
                    keywords: this.parseKeywords(card.cardText),
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

                if (!newCard.locale) {
                    // Just a safe check, but since 'en' is supposed to be loaded first, locale
                    // will already exist
                    newCard.locale = [];
                }

                newCard.locale[language.replace('-', '')] = {
                    name: card.cardTitle
                };
            }

            // Sort locale by key
            newCard.locale = Object.keys(newCard.locale)
                .sort()
                .reduce((newLocale, currentValue) => {
                    newLocale[currentValue] = newCard.locale[currentValue];
                    return newLocale;
                }, {});

            cards[card.cardNumber] = newCard;
        }

        return Object.values(cards);
    }

    parseKeywords(text) {
        const lines = text.split(/[\r\v]/);
        let potentialKeywords = [];

        for (const line of lines) {
            potentialKeywords = potentialKeywords.concat(
                line.split('.').map((k) => k.toLowerCase().trim().replace(' ', ':'))
            );
        }

        const printedKeywords = potentialKeywords.filter((potentialKeyword) => {
            return ValidKeywords.some((keyword) => potentialKeyword.indexOf(keyword) === 0);
        });

        return printedKeywords;
    }
}

module.exports = DecksOfKeyforgeApiToKeytekiConverter;
