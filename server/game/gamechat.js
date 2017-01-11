const _ = require('underscore');

const BaseCard = require('./basecard.js');
const Spectator = require('./spectator.js');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(message) {
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addMessage(message) {
        var args = Array.from(arguments).slice(1);
        var argList = [];

        args = _.reduce(args, (argList, arg) => {
            if(arg instanceof Spectator) {
                argList.push(arg.name);
            } else {
                argList.push(arg);
            }

            return argList;
        }, argList);

        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    formatMessage(format, args) {
        if(_.isNull(format) || _.isUndefined(format)) {
            return '';
        }
        
        var messageFragments = format.split(/(\{\d+\})/);

        return _.map(messageFragments, fragment => {
            var argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                var arg = args[argMatch[1]];
                if(!_.isUndefined(arg) && !_.isNull(arg)) {
                    if(arg instanceof BaseCard) {
                        return { code: arg.code, label: arg.name, type: arg.getType() };
                    } else if(arg instanceof Spectator) {
                        return { name: arg.user.username, emailHash: arg.user.emailHash };
                    }

                    return arg;
                }

                return '';
            }

            return fragment;
        });
    }
}

module.exports = GameChat;
