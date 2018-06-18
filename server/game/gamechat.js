const _ = require('underscore');

const GameObject = require('./GameObject');
const Spectator = require('./spectator.js');
const Player = require('./player.js');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(message) {
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        var args = Array.from(arguments).slice(1);
        var argList = [];

        args = _.reduce(args, (argList, arg) => {
            if(arg instanceof Player) {
                argList.push(arg.name);
            } else {
                argList.push(arg);
            }

            return argList;
        }, argList);

        return this.formatMessage(message, args);
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
        if(_.isNull(format) || _.isUndefined(format)) {
            return '';
        }

        var messageFragments = format.split(/(\{\d+\})/);

        return _.map(messageFragments, fragment => {
            var argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                var arg = args[argMatch[1]];
                if(!_.isUndefined(arg) && !_.isNull(arg)) {
                    if(_.isArray(arg)) {
                        return this.formatArray(arg);
                    } else if((arg instanceof Player) || (arg instanceof Spectator)) {
                        return { name: arg.user.username, emailHash: arg.user.emailHash, noAvatar: arg.user.settings.disableGravatar };
                    } else if(arg instanceof GameObject) {
                        return arg.getShortSummary();
                    }
                    return arg;
                }

                return '';
            }

            return fragment;
        });
    }

    formatArray(array) {
        if(array.length === 0) {
            return '';
        }

        var format;

        if(array.length === 1) {
            format = '{0}';
        } else if(array.length === 2) {
            format = '{0} and {1}';
        } else {
            var range = _.map(_.range(array.length - 1), i => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }
}

module.exports = GameChat;
