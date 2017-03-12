const config = require('../config.js');
const db = require('monk')(config.dbPath);
const decks = db.get('decks');

class DeckRepository {
    getById(id) {
        return decks.findOne({ _id: id });
    }
}

module.exports = DeckRepository;

