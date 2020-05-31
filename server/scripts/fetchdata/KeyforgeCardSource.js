/*eslint no-console:0 */
const util = require('../../util');

const ValidKeywords = [
    'elusive',
    'skirmish',
    'taunt',
    'deploy',
    'alpha',
    'omega',
    'hazardous',
    'assault'
];

class JsonCardSource {
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    parseKeywords(text) {
        let firstLine = text.split('\n')[0] || '';
        let potentialKeywords = firstLine.split('.').map((k) => k.toLowerCase().trim());

        let printedKeywords = potentialKeywords.filter((potentialKeyword) => {
            return ValidKeywords.some((keyword) => potentialKeyword.indexOf(keyword) === 0);
        });

        return printedKeywords;
    }

    async getCards() {
        const pageSize = 50;
        const expectedCardCount = 370;
        const apiUrl = 'https://www.keyforgegame.com/api/decks/';

        console.info('Fetching the deck list...');

        let response;
        let cards = { 341: {}, 435: {} };
        let pageErrors = [];

        try {
            response = await util.httpRequest(apiUrl, { json: true });
        } catch (err) {
            console.info(err);

            return;
        }

        let deckCount = response.count;
        let totalPages = Math.ceil(deckCount / pageSize);

        console.info(`Fetching all ${deckCount} decks, which is ${totalPages} pages`);

        for (let i = 1; i < totalPages; i++) {
            try {
                response = await util.httpRequest(
                    `${apiUrl}/?page=${i}&links=cards&page_size=${pageSize}&ordering=-date`,
                    { json: true }
                );
            } catch (err) {
                if (err.statusCode === 429) {
                    await this.sleep(100);
                    i--;
                    continue;
                }

                pageErrors.push(i);

                console.info(`Page ${i} failed, will try it later`);
                continue;
            }

            if (!response) {
                pageErrors.push(i);

                console.info(`Page ${i} failed, will try it later`);
                continue;
            }

            for (let card of response._linked.cards) {
                if (!cards[card.expansion][card.card_number]) {
                    let newCard = {
                        name: card.card_title,
                        number: card.card_number,
                        image: card.front_image,
                        expansion: card.expansion,
                        house: card.house,
                        keywords: this.parseKeywords(card.card_text),
                        traits: card.traits,
                        type: card.card_type,
                        rarity: card.rarity,
                        amber: card.amber,
                        armor: card.armor,
                        power: card.power,
                        text: card.card_text
                    };

                    cards[card.expansion][card.card_number] = newCard;
                }
            }

            if (
                Object.values(cards[341]).length === expectedCardCount &&
                Object.values(cards[435]).length === expectedCardCount
            ) {
                console.info('Got all the cards we were expecting');

                break;
            }

            if (i % 10 === 0) {
                console.info(
                    `Processed ${i} pages, ${totalPages - i} to go.  Have ${
                        Object.values(cards[341]).length
                    } CoTA cards and ${Object.values(cards[435]).length} AoA cards so far..`
                );
            }
        }

        return Object.values(cards[341]).concat(Object.values(cards[435]));
    }
}

module.exports = JsonCardSource;
