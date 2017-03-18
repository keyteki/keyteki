const monk = require('monk');

class MessageRepository {
    constructor(dbPath) {
        var db = monk(dbPath);
        this.messages = db.get('messages');
    }
    addMessage(message) {
        return this.messages.insert(message);
    }

    getLastMessages() {
        return this.messages.find({}, { limit: 50, sort : { time: -1 }});
    }
}

module.exports = MessageRepository;
