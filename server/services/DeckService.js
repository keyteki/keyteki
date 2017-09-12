const logger = require('../log.js');

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

    findByUserName(userName) {
        return this.decks.find({ username: userName }, { sort: { lastUpdated: -1 } });
    }

    create(deck) {
        let properties = {
            username: deck.username,
            name: deck.deckName,
            provinceCards: deck.provinceCards,
            stronghold: deck.stronghold,
            role: deck.role,
            conflictCards: deck.conflictCards,
            dynastyCards: deck.dynastyCards,
            faction: deck.faction,
            alliance: deck.alliance,
            lastUpdated: new Date()
        };

        return this.decks.insert(properties);
    }

    update(deck) {
        let properties = {
            name: deck.deckName,
            provinceCards: deck.provinceCards,
            stronghold: deck.stronghold,
            role: deck.role,
            conflictCards: deck.conflictCards,
            dynastyCards: deck.dynastyCards,
            faction: deck.faction,
            alliance: deck.alliance,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }
}

module.exports = DeckService;

