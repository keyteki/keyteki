const logger = require('../log.js');

class MessageService {
    constructor(db) {
        this.messages = db.get('messages');
    }
    addMessage(message) {
        return this.messages.insert(message)
            .catch(err => {
                logger.error('Unable to insert message', err);
                throw new Error('Unable to insert message');
            });
    }

    getLastMessages() {
        return this.messages.find({}, { limit: 150, sort: { time: -1 } });
    }
}

module.exports = MessageService;
