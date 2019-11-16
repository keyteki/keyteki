
const Card = require('./Card.js');
const Spectator = require('./spectator.js');
const Player = require('./player.js');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(format, player, message) {
        let args = [
            { name: player.name, argType: 'player', role: player.user && player.user.role },
            message
        ];
        let formattedMessage = this.formatMessage(format, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        let args = Array.from(arguments).slice(1);
        let argList = args.map(arg => {
            if(arg instanceof Spectator) {
                return { name: arg.name, argType: 'nonAvatarPlayer', role: arg.role };
            } else if(arg && arg.name && arg.argType === 'player') {
                return { name: arg.name, argType: arg.argType, role: arg.role };
            }

            return arg;
        });

        return this.formatMessage(message, argList);
    }

    addMessage(message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);
        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({ date: new Date(), message: { alert: { type: type, message: formattedMessage } } });
    }

    formatMessage(format, args) {
        if(!format || typeof (format) !== 'string') {
            return '';
        }

        let messageFragments = format.split(/(\{\d+\})/);
        let returnedFraments = [];

        for(const fragment of messageFragments) {
            let argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                let arg = args[argMatch[1]];
                if(arg || arg === 0) {
                    if(Array.isArray(arg)) {
                        returnedFraments.push(this.formatArray(arg));
                    } else if(arg instanceof Card) {
                        returnedFraments.push({ name: arg.name, image: arg.image, label: arg.name, type: arg.getType(),
                            maverick: arg.maverick, anomaly: arg.anomaly, cardPrintedAmber: arg.cardPrintedAmber, argType: 'card' });
                    } else if(arg instanceof Spectator || arg instanceof Player) {
                        returnedFraments.push({ name: arg.user.username, argType: 'nonAvatarPlayer' });
                    } else {
                        returnedFraments.push(arg);
                    }
                }

                continue;
            }

            if(fragment) {
                returnedFraments.push(fragment);
            }
        }

        return returnedFraments;
    }

    formatArray(array) {
        if(array.length === 0) {
            return '';
        }

        let format;

        if(array.length === 1) {
            format = '{0}';
        } else if(array.length === 2) {
            format = '{0} and {1}';
        } else {
            let range = [...Array(array.length - 1).keys()].map(i => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }
}

module.exports = GameChat;
