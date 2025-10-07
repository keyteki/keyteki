import uuid from 'uuid';

import Card from './Card.js';
import Spectator from './spectator.js';
import Player from './player.js';

class GameChat {
    constructor(game) {
        this.messages = [];
        this.game = game;
    }

    addChatMessage(format, player, message) {
        let args = [
            {
                name: player.name,
                argType: 'player',
                role: player.user && player.user.role,
                avatar: player.user && player.user.avatar
            },
            message.substring(0, Math.min(512, message.length))
        ];
        let formattedMessage = this.formatMessage(format, args);

        this.messages.push({ id: uuid.v1(), date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        let args = Array.from(arguments).slice(1);
        let argList = args.map((arg) => {
            if (arg instanceof Spectator) {
                return {
                    name: arg.name,
                    argType: 'nonAvatarPlayer',
                    role: arg.user.role,
                    avatar: arg.user.avatar
                };
            } else if (arg && arg.name && arg.argType === 'player') {
                return {
                    name: arg.name,
                    argType: arg.argType,
                    role: arg.user.role,
                    avatar: arg.user.avatar
                };
            }

            return arg;
        });

        return this.formatMessage(message, argList);
    }

    addMessage(message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);
        this.messages.push({
            id: uuid.v1(),
            date: new Date(),
            message: formattedMessage,
            activePlayer: this.game.activePlayer && this.game.activePlayer.name
        });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({
            id: uuid.v1(),
            date: new Date(),
            message: { alert: { type: type, message: formattedMessage } },
            activePlayer: this.game.activePlayer && this.game.activePlayer.name
        });
    }

    formatMessage(format, args) {
        if (!format || typeof format !== 'string') {
            return '';
        }

        let messageFragments = format.split(/(\{\d+\})/);
        let returnedFraments = [];

        for (const fragment of messageFragments) {
            let argMatch = fragment.match(/\{(\d+)\}/);
            if (argMatch) {
                let arg = args[argMatch[1]];
                if (arg || arg === 0) {
                    if (Array.isArray(arg)) {
                        returnedFraments.push(this.formatArray(arg));
                    } else if (arg instanceof Card) {
                        let summary = arg.getShortSummary();
                        returnedFraments.push({
                            argType: 'card',
                            ...summary
                        });
                    } else if (arg instanceof Spectator || arg instanceof Player) {
                        returnedFraments.push({
                            name: arg.user.username,
                            argType: 'nonAvatarPlayer',
                            role: arg.user.role
                        });
                    } else {
                        returnedFraments.push(arg);
                    }
                }

                continue;
            }

            if (fragment) {
                returnedFraments.push(fragment);
            }
        }

        return returnedFraments;
    }

    formatArray(array) {
        if (array.length === 0) {
            return '';
        }

        let format;

        if (array.length === 1) {
            format = '{0}';
        } else if (array.length === 2) {
            format = '{0} and {1}';
        } else {
            let range = [...Array(array.length - 1).keys()].map((i) => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }
}

export default GameChat;
