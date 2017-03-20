const logger = require('../log.js');

const BaseRepository = require('./baseRepository.js');

class MessageRepository extends BaseRepository {
    addMessage(message) {
        return this.db.collection('messages').insert(message, err => {
            if(err) {
                logger.error(err);
            }
        });
    }

    getLastMessages(callback) {
        return this.db.collection('messages').find({}, { limit: 50, sort : { time: -1 }}).toArray((err, messages) => {
            if(err) {
                this.callCallbackIfPresent(callback, err);
            }

            this.callCallbackIfPresent(callback, err, messages);
        });
    }
}

module.exports = MessageRepository;
