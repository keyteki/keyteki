const { randomUUID } = require('node:crypto');

const Card = require('./Card.js');
const GameObject = require('./GameObject.js');
const Spectator = require('./spectator.js');
const Player = require('./player.js');

class GameChat {
    constructor(game) {
        this.messages = [];
        this.game = game;
    }

    addChatMessage(format, player, message) {
        const args = [
            {
                name: player.name,
                argType: 'player',
                role: player.user && player.user.role,
                avatar: player.user && player.user.avatar
            },
            message.substring(0, Math.min(512, message.length))
        ];
        const formattedMessage = this.formatMessage(format, args);

        this.messages.push({ id: randomUUID(), date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        const args = Array.from(arguments).slice(1);
        const argList = args.map((arg) => {
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
        const formattedMessage = this.getFormattedMessage(message, ...args);
        this.messages.push({
            id: randomUUID(),
            date: new Date(),
            message: formattedMessage,
            activePlayer: this.game.activePlayer && this.game.activePlayer.name
        });
    }

    addAlert(type, message, ...args) {
        const formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({
            id: randomUUID(),
            date: new Date(),
            message: { alert: { type: type, message: formattedMessage } },
            activePlayer: this.game.activePlayer && this.game.activePlayer.name
        });
    }

    formatMessage(format, args) {
        if (!format || typeof format !== 'string') {
            return '';
        }

        const messageFragments = format.split(/(\{\d+\})/);
        const returnedFraments = [];

        for (const fragment of messageFragments) {
            const argMatch = fragment.match(/\{(\d+)\}/);
            if (argMatch) {
                const arg = args[argMatch[1]];
                if (arg || arg === 0) {
                    if (Array.isArray(arg)) {
                        returnedFraments.push(this.formatArray(arg));
                    } else if (arg instanceof Card) {
                        const summary = arg.getShortSummary();
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
                    } else if (arg instanceof GameObject) {
                        // Defense-in-depth: any non-Card GameObject (e.g. a
                        // framework EffectSource) carries back-references to
                        // the game graph and would create circular structures
                        // when serialized.  The client message renderer only
                        // handles card/player fragments specially, so emit a
                        // plain string fallback rather than an unrecognised
                        // fragment shape that would render as "[object Object]".
                        returnedFraments.push(String(arg.name || 'unknown'));
                    } else if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
                        // Last-ditch guard for any other unexpected object
                        // arg.  Recognised fragment shapes (those with an
                        // `argType` or a nested `message` produced by
                        // formatArray) are passed through.  Anything else is
                        // reduced to a short string summary so it can't render
                        // as "[object Object]" on the client or embed
                        // unintended data in the gamestate.
                        if (typeof arg.argType === 'string' || arg.message !== undefined) {
                            returnedFraments.push(arg);
                        } else {
                            returnedFraments.push(this.summarizeUnknownArg(arg));
                        }
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
            const range = [...Array(array.length - 1).keys()].map((i) => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }

    /**
     * Reduce an unexpected object argument to a short, safe string summary so
     * it can be rendered by the client without showing "[object Object]" and
     * without embedding arbitrary or potentially circular data in the
     * gamestate.
     */
    summarizeUnknownArg(arg) {
        if (arg && typeof arg.name === 'string') {
            return arg.name;
        }

        const ctor = arg && arg.constructor && arg.constructor.name;
        return ctor ? `[${ctor}]` : '[unknown]';
    }
}

module.exports = GameChat;
