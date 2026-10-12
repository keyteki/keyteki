const fs = require('fs');

const { cardIdFromTitle } = require('./cardId');
const { httpRequest, parseKeywords, sortLocales, writePack } = require('./cardData');
const { applyOverrides } = require('./overrides');

function decodeEntities(text) {
    return text.replace(/&quot;/gi, '"').replace(/&#039;/gi, "'");
}

/**
 * Builds pack data from the Archon Arcana wiki, for use during spoiler season before cards are
 * available from Master Vault.
 */
class ArchonArcanaApiToKeytekiConverter {
    async convert({ pathToPackFile, language, setName }) {
        console.log('Loading ' + language + ' cards...');

        let pack = JSON.parse(fs.readFileSync(pathToPackFile));

        let cards;
        try {
            cards = await this.getCards(pack, language, setName || pack.name);
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

    async getCards(pack, language, setName) {
        const apiUrl =
            'https://archonarcana.com/api.php?action=cargoquery&format=json&tables=CardData, SetData&' +
            'fields=CardData.Power,CardData.Rarity,CardData.Name,CardData.House,CardData.Type,CardData.Image,' +
            'CardData.House,SetData.CardNumber,SetData.Meta,CardData.Text,CardData.SearchText,CardData.SearchFlavorText,' +
            'CardData.Traits,CardData.Armor,CardData.Source,CardData.Amber,CardData._rowID=RowID&' +
            `where=((SetName="${setName}") AND (Meta="SpoilerNew" AND Name IS NOT NULL))&` +
            'join_on=CardData._pageName=SetData._pageName&group_by=CardData.Power,CardData.Rarity,CardData.Name,' +
            'CardData.House,CardData.Type,CardData.Image,CardData.House,SetData.CardNumber,SetData.Meta,CardData.Text,' +
            'CardData.SearchText,CardData.SearchFlavorText,CardData.Traits,CardData.Armor,CardData.Source,CardData.Amber,' +
            'CardData._rowID&limit=500&offset=0&order_by=CardNumber';

        let packCardMap = pack.cards.reduce(function (map, obj) {
            map[obj.number] = obj;
            return map;
        }, {});

        let response;
        try {
            response = await httpRequest(apiUrl, { json: true });
        } catch (err) {
            console.info(err);

            return;
        }

        let cards = {};
        let generatedNumber = 900;
        let generatedNumberCards = {};

        console.log(`Loading ${response.cargoquery.length} cards for ${setName}`);

        for (let el of response.cargoquery) {
            let card = el.title;

            if (!card.Name) {
                continue;
            }

            if (!card.CardNumber) {
                generatedNumberCards[card.Name] =
                    generatedNumberCards[card.Name] || ++generatedNumber;
                card.CardNumber = String(generatedNumberCards[card.Name]);
            }

            card.CardNumber = card.CardNumber.replace('~', '').replace(/[ ?]+$/, '');

            if (card.CardNumber === '000') {
                console.log('Ignoring scenario card: ', card.Name);
                continue;
            }

            let name = decodeEntities(card.Name).replace(/[ ?]+$/, '');
            let isEvilTwin = false;
            if (/\s*\(Evil Twin\)$/i.test(name)) {
                name = name.replace(/\s*\(Evil Twin\)$/i, '');
                isEvilTwin = true;
            }

            let id = name ? cardIdFromTitle(name) : 'card-' + card.CardNumber;
            if (isEvilTwin) {
                id += '-evil-twin';
            }

            let newCard = null;

            if (language === 'en') {
                let cardText = !card.SearchText
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
                    id: id,
                    name: name,
                    number: card.CardNumber,
                    image: card.Image,
                    expansion: parseInt(pack.ids[0]),
                    house: card.House.toLowerCase().replace(' ', ''),
                    keywords: parseKeywords(cardText),
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
                            name: name
                        }
                    }
                };
            } else {
                // Append locale information to the card loaded by the English import
                newCard = packCardMap[card.CardNumber];
                if (!newCard) {
                    continue;
                }

                newCard.locale = newCard.locale || {};
                newCard.locale[language.replace('-', '')] = { name: name };
            }

            newCard.locale = sortLocales(newCard.locale);

            cards[card.CardNumber] = newCard;
        }

        return Object.values(cards);
    }
}

module.exports = ArchonArcanaApiToKeytekiConverter;
