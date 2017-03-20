const logger = require('../log.js');
const mongoskin = require('mongoskin');

const BaseRepository = require('./baseRepository.js');

class DeckRepository extends BaseRepository {
    getById(id, callback) {
        return this.decks.findOne({ _id: mongoskin.helper.toObjectID(id) }, (err, deck) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);
            }

            this.callCallbackIfPresent(callback, err, deck);
        });
    }
}

module.exports = DeckRepository;

