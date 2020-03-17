const logger = require('../log.js');
const util = require('../util.js');

const uuid = require('uuid-random');

const templateDeck = {
    "expansion": 0,
    // username
    // uuid
    // identiy
    // name
    "cardback": "",
    "banned": false,
    "verified": false,
    "includeInSealed": false,
    "houses": ["alchemist"],
    "cards": [
    ]
};

class DeckBuilderService {
    constructor(db) {
        this.decks = db.get('decks');
        this.games = db.get('games');
        this.cards = db.get('cards');

        this.buildingDecks = {};
    }

    async create(username) {
         delete this.buildingDecks[username];

        this.buildingDecks[username] = Object.assign({}, templateDeck);
        this.buildingDecks[username].username = username;
        this.buildingDecks[username].cards = [];
        this.buildingDecks[username].uuid = uuid();
    }

    addCard(username, cardId) {
        if (!cardId || cardId === '') {
            return;
        }
        var userdeck = this.buildingDecks[username];
        var cardReference = userdeck.cards.find(card => card.id == cardId);
        if (cardReference) {
            cardReference.count += 1;
        } 
        else {
            this.buildingDecks[username].cards.push(
                {
                    "id": cardId,
                    "count": 1
                }
            );
        }

        return this.buildingDecks[username].cards;
    }

    removeCard(username, cardId) {
        return this.buildingDecks[username].cards;
    }

    getDeck(username) {
        return this.buildingDecks[username];
    }

    saveDeck(username) {
        this.buildingDecks[username].identity = 'identity';
        this.decks.insert(this.buildingDecks[username]);
        delete this.buildingDecks[username];
    }
}

module.exports = DeckBuilderService;

