const monk = require('monk');

class DeckRepository {
    constructor(dbPath) {
        var db = monk(dbPath);
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id });
    }
}

module.exports = DeckRepository;

