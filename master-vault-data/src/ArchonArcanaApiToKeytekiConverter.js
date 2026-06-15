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
        const apiUrl =
            'https://archonarcana.com/api.php?action=cargoquery&format=json&tables=CardData, SetData&' +
            'fields=CardData.Power,CardData.Rarity,CardData.Name,CardData.House,CardData.Type,CardData.Image,' +
            'CardData.House,SetData.CardNumber,SetData.Meta,CardData.Text,CardData.SearchText,CardData.SearchFlavorText,' +
            'CardData.Traits,CardData.Armor,CardData.Source,CardData.Amber,CardData._rowID=RowID&' +
            'where=((SetName="Winds of Exchange") AND (Meta="SpoilerNew" AND Name IS NOT NULL))&' +
            'join_on=CardData._pageName=SetData._pageName&group_by=CardData.Power,CardData.Rarity,CardData.Name,' +
            'CardData.House,CardData.Type,CardData.Image,CardData.House,SetData.CardNumber,SetData.Meta,CardData.Text,' +
            'CardData.SearchText,CardData.SearchFlavorText,CardData.Traits,CardData.Armor,CardData.Source,CardData.Amber,' +
            'CardData._rowID&limit=300&offset=0&order_by=CardNumber';

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

        console.log(`Loading ${response.cargoquery.length} cards`);

        for (const el of response.cargoquery) {
            const card = el.title;

            if (!card.CardNumber) {
                generatedNumberCards[card.cardTitle] =
                    generatedNumberCards[card.cardTitle] || ++generatedNumber;
                card.CardNumber = generatedNumberCards[card.cardTitle];
            }

            card.CardNumber = card.CardNumber.replace('~', '');

            /*
            if(!pack.ids.includes('' + card.expansion) || cards[card.cardNumber] || card.maverick) {
                console.log('Ignoring card: ', card.cardTitle, card.expansion, card.cardNumber, card.maverick);
                continue;
            }
            */

            if (card.CardNumber === '000') {
                console.log('Ignoring scenario card: ', card.Name);
                continue;
            }

            if (card.Name === '') {
                continue;
            }

            // Fix the house of an anomaly to brobnar so that we can test them until they get a real house
            if (card.anomaly) {
                // TODO
                card.house = 'brobnar';
            }

            let cardId = card.Name;
            while (cardId.endsWith(' ') || cardId.endsWith('?')) {
                cardId = cardId.substring(0, cardId.length - 1);
            }

            while (card.CardNumber.endsWith(' ') || card.CardNumber.endsWith('?')) {
                card.CardNumber = card.CardNumber.substring(0, card.length - 1);
            }

            if (cardId === '') {
                cardId = 'card-' + card.CardNumber;
            }

            let newCard = null;

            if (language === 'en') {
                const cardText = !card.SearchText
                    ? ''
                    : card.SearchText.replace(/&lt;/gi, '<')
                          .replace(/&gt;/gi, '>')
                          .replace(/&quot;/gi, '"')
                          .replace(/&#039;(&#039;)+/gi, '')
                          .replace(/&#039;/gi, "'")
                          .replace(/<[^>]+aember[^>]+>/gi, 'A')
                          .replace(/<[^>]+damage[^>]+>/gi, 'D')
                          .replace(/(?<=[0-9]) ?Aember/gi, 'A')
                          .replace(/(?<=[0-9]) ?Damage/gi, 'D')
                          .replace(/\[\[File:Enhance_A[^\]]+\]\]/gi, 'A')
                          .replace(/<br>/gi, '\n')
                          .replace(/<p>/gi, '\n')
                          .replace(/<[^>]+>/gi, '');

                newCard = {
                    id: cardId
                        .toLowerCase()
                        .replace(/[?.!",“”]/gi, '')
                        .replace(/&quot;/gi, '')
                        .replace('??', ' ')
                        .replace(/[ĂÀÁÃǍăàáãǎ]/g, 'a')
                        .replace(/[ĔÈÉĚĕèéě]/g, 'e')
                        .replace(/[ĬÌÍǏĭìíǐ]/g, 'i')
                        .replace(/[ŎÒÓÕǑŏòóõǒ]/g, 'o')
                        .replace(/[ŬÙÚǓŭùúǔ]/g, 'u')
                        .replace(/[Çç]/g, 'c')
                        .replace('   ', ' ')
                        .replace('  ', ' ')
                        .replace(/[ '’]/gi, '-')
                        .replace('-(evil-twin)', '-evil-twin')
                        .replace('-()', ''),
                    name: card.Name.replace(/&quot;/gi, '"'),
                    number: card.CardNumber,
                    image: card.Image,
                    //expansion: card.expansion,
                    house: card.House.toLowerCase().replace(' ', ''),
                    keywords: !card.Text ? [] : this.parseKeywords(card.Text),
                    traits: !card.Traits
                        ? []
                        : card.Traits.split(' • ').map((trait) => trait.toLowerCase()),
                    type: card.Type.toLowerCase(),
                    rarity: card.Rarity,
                    amber: card.Amber === '' ? 0 : parseInt(card.Amber),
                    armor:
                        card.Type.toLowerCase() === 'creature'
                            ? card.Armor !== ''
                                ? parseInt(card.Armor)
                                : 0
                            : null,
                    power: card.Power === '' ? null : parseInt(card.Power),
                    text: cardText,
                    locale: {
                        en: {
                            name: card.Name.replace(/&quot;/gi, '"')
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

            cards[card.CardNumber] = newCard;
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
            console.log(line, potentialKeywords);
        }

        const printedKeywords = potentialKeywords.filter((potentialKeyword) => {
            return ValidKeywords.some((keyword) => potentialKeyword.indexOf(keyword) === 0);
        });

        console.log('printedKeywords: ', printedKeywords);

        return printedKeywords;
    }
}

module.exports = DecksOfKeyforgeApiToKeytekiConverter;
