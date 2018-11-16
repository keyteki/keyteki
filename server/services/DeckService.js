const logger = require('../log.js');

class DeckService {
    constructor(db) {
        this.decks = db.get('vaultDecks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }

    getByUuid(uuid) {
        return this.decks.findOne({ uuid: uuid })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });        
    }

    findByUserName(userName) {
        let decks = this.decks.find({ username: 'public', banned: false }, { sort: { lastUpdated: -1 } });
        return decks;
    }

    create(deck) {
        let properties = {
            uuid: deck.uuid,
            //username: deck.username,
            identity: deck.identity,
            //cardback: deck.cardback,
            name: deck.name,
            banned: deck.banned,
            houses: deck.houses,
            cards: deck.cards,
            lastUpdated: new Date()
        };

        return this.decks.insert(properties);
    }

    update(deck) {
        let properties = {
            username: deck.username,
            name: deck.deckName,
            houses: deck.houses,
            cards: deck.cards,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }
}

module.exports = DeckService;

