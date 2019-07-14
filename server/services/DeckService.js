const logger = require('../log.js');
const util = require('../util.js');
const _ = require('underscore');

class DeckService {
    constructor(db) {
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }

    getSealedDeck() {
        return this.decks.aggregate([{ $match: { includeInSealed: true } }, { $sample: { size: 1 } }]);
    }

    getByUuid(uuid) {
        return this.decks.findOne({ uuid: uuid })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + uuid);
            });
    }

    findByUserName(userName) {
        let decks = this.decks.find({ username: userName, banned: false }, { sort: { lastUpdated: -1 } });
        return decks;
    }

    async create(deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(`https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`);

            if(response[0] === '<') {
                logger.error('Deck failed to import', deck.uuid, response);

                return;
            }

            deckResponse = JSON.parse(response);
        } catch(error) {
            logger.error('Unable to import deck', deck.uuid, error);

            return;
        }

        if(!deckResponse || !deckResponse._linked || !deckResponse.data) {
            return;
        }

        let cards = deckResponse._linked.cards.map(card => {
            let id = card.card_title.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-');
            if(card.is_maverick) {
                return { id: id, count: 1, maverick: card.house.toLowerCase() };
            }
            return { id: id, count: deckResponse.data._links.cards.filter(uuid => uuid === card.id).length };
        });
        let uuid = deckResponse.data.id;

        let illegalCard = cards.find(card => !card.id.split('').every(char => 'æabcdefghijklmnopqrstuvwxyz0123456789-[]'.includes(char)));
        if(!illegalCard) {
            let otherDecks = await this.decks.find({ uuid: uuid });
            otherDecks = _.uniq(otherDecks, deck => deck.username);
            if(otherDecks.length >= 3) {
                await this.decks.update({ uuid: uuid }, { '$set': { flagged: true } }, { multi: true });
            }
            return await this.decks.insert({
                username: deck.username,
                uuid: uuid,
                identity: deckResponse.data.name.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-'),
                cardback: '',
                name: deckResponse.data.name,
                banned: false,
                flagged: otherDecks.length >= 3,
                verified: false,
                includeInSealed: false,
                houses: deckResponse.data._links.houses.map(house => house.toLowerCase()),
                cards: cards,
                lastUpdated: new Date()
            });
        }

        logger.error(`DECK IMPORT ERROR: ${illegalCard.id.split('').map(char => char.charCodeAt(0))}`);
    }

    update(deck) {
        let properties = {
            verified: deck.verified,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }

    async getFlaggedUnverifiedDecksForUser(username) {
        return await this.decks.find({ username: username, verified: false, flagged: true });
    }

    async verifyDecksForUser(username) {
        return await this.decks.update({username: username, verified: false, flagged: true}, {$set: { verified: true }}, { multi: true });
    }
}

module.exports = DeckService;

