const logger = require('../log.js');
const util = require('../util.js');

class DeckBuilderService {
    constructor(db) {
        this.decks = db.get('decks');
        this.games = db.get('games');

        this.buildingDecks = {};
    }

    // async create(deck) {
    //     let deckResponse;

    //     try {
    //         let response = await util.httpRequest(`https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`);

    //         if(response[0] === '<') {
    //             logger.error('Deck failed to import', deck.uuid, response);

    //             return;
    //         }

    //         deckResponse = JSON.parse(response);
    //     } catch(error) {
    //         logger.error('Unable to import deck', deck.uuid, error);

    //         return;
    //     }

    //     if(!deckResponse || !deckResponse._linked || !deckResponse.data) {
    //         return;
    //     }

    //     let cards = deckResponse._linked.cards.map(card => {
    //         let id = card.card_title.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-');
    //         if(card.is_maverick) {
    //             return { id: id, count: 1, maverick: card.house.replace(' ', '').toLowerCase() };
    //         }

    //         if(card.is_anomaly) {
    //             return { id: id, count: 1, anomaly: card.house.replace(' ', '').toLowerCase() };
    //         }

    //         return { id: id, count: deckResponse.data._links.cards.filter(uuid => uuid === card.id).length };
    //     });
    //     let uuid = deckResponse.data.id;

    //     let illegalCard = cards.find(card => !card.id.split('').every(char => 'æabcdefghijklmnoöpqrstuvwxyz0123456789-[]'.includes(char)));
    //     if(!illegalCard) {
    //         return await this.decks.insert({
    //             expansion: deckResponse.data.expansion,
    //             username: deck.username,
    //             uuid: uuid,
    //             identity: deckResponse.data.name.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-'),
    //             cardback: 'cardback',
    //             name: deckResponse.data.name,
    //             banned: false,
    //             verified: false,
    //             includeInSealed: false,
    //             houses: deckResponse.data._links.houses.map(house => house.replace(' ', '').toLowerCase()),
    //             cards: cards,
    //             lastUpdated: new Date()
    //         });
    //     }

    //     logger.error(`DECK IMPORT ERROR: ${illegalCard.id.split('').map(char => char.charCodeAt(0))}`);
    // }

    async create(username) {
        console.log(username + " wants to create a deck!");
    }

    async addCard(username, cardId) {

    }

    async removeCard(username, cardId) {
        
    }
}

module.exports = DeckBuilderService;

