const logger = require('../log.js');
const util = require('../util.js');

const uuid = require('uuid');

const templateDeck = {
    'expansion': 0,
    // username
    // uuid
    // identiy
    // name
    'cardback': './img/cards/cardback.png',
    'factions': ['alchemist'],
    'cards': [
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
        this.buildingDecks[username].total = 0;
        this.buildingDecks[username].uuid = uuid();
    }

    addCard(username, cardId) {
        if (!cardId || cardId === '') {
            return;
        }
        var userdeck = this.buildingDecks[username];
        var cardReference = userdeck.cards.find(card => card.id === cardId);
        if (cardReference && cardReference.count < 3) {
            cardReference.count += 1;
            this.buildingDecks[username].total++;
        } else if (cardReference && cardReference.count === 3) {
            cardReference.count = 3;
        } else {
            this.buildingDecks[username].cards.push(
                {
                    "id": cardId,
                    "count": 1
                }
            );
            this.buildingDecks[username].total++;
        }

        return this.buildingDecks[username];
    }

    removeCard(username, cardId, count) {
        var userdeck = this.buildingDecks[username];
        var cardReference = userdeck.cards.find(card => card.id === cardId);
        if (cardReference) {
            if (cardReference.count > count) {
                cardReference.count -= count;
                this.buildingDecks[username].total--;
            } else {
                this.buildingDecks[username].total = userdeck.total - userdeck.cards.find(card => card.id === cardId).count;
                userdeck.cards = userdeck.cards.filter(card => card.id !== cardId);
            }
        }
        return this.buildingDecks[username];
    }

    getDeck(username) {
        return this.buildingDecks[username];
    }

    saveDeck(username, deckName) {
        this.buildingDecks[username].identity = 'identity';
        this.buildingDecks[username].name = deckName;
        this.decks.insert(this.buildingDecks[username]);
        delete this.buildingDecks[username];
    }
}

module.exports = DeckBuilderService;
