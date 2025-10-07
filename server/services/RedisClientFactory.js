import redis from 'redis';

class RedisClientFactory {
    constructor(configService) {
        this.configService = configService;
        const rawPrefix = configService.getValue('redisKeyPrefix') || '';
        this.prefix = rawPrefix ? rawPrefix + ':' : '';
    }

    createClient() {
        const client = redis.createClient({
            url: this.configService.getValue('redisUrl')
        });

        return this.wrapClient(client);
    }

    wrapClient(client) {
        const prefix = this.prefix;
        const originalGet = client.get.bind(client);
        const originalSet = client.set.bind(client);
        const originalPublish = client.publish.bind(client);
        const originalSubscribe = client.subscribe.bind(client);

        client.get = async function (key) {
            return originalGet(prefix + key);
        };

        client.set = async function (key, value, options) {
            return originalSet(prefix + key, value, options);
        };

        client.publish = async function (channel, message) {
            return originalPublish(prefix + channel, message);
        };

        client.subscribe = async function (channel, listener) {
            const wrappedListener = (message, originalChannel) => {
                const unprefixedChannel = originalChannel.startsWith(prefix)
                    ? originalChannel.substring(prefix.length)
                    : originalChannel;
                listener(message, unprefixedChannel);
            };
            return originalSubscribe(prefix + channel, wrappedListener);
        };

        return client;
    }
}

export default RedisClientFactory;
