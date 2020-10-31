const redis = require('redis');

const { promisify } = require('util');

class MessageService {
    constructor(configService) {
        this.redis = redis.createClient(configService.getValue('redisUrl'));

        this.lrangeAsync = promisify(this.redis.lrange).bind(this.redis);
        //   this.setAsync = promisify(this.redis.set).bind(this.redis);
    }

    async getLastMessagesForUser() {
        let messages = await this.lrangeAsync('messages', 0, 50);

        if (messages) {
            messages = messages.map((m) => JSON.parse(m));
        }

        return messages;
    }
}

module.exports = MessageService;
