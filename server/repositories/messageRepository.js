const db = require('monk')('mongodb://127.0.0.1:27017/throneteki');
const messages = db.get('messages');

class MessageRepository {
    addMessage(message) {
        return messages.insert(message);
    }

    getLastMessages() {
        return messages.find({}, { limit: 50, sort : { time: -1 }});
    }
}

module.exports = MessageRepository;
