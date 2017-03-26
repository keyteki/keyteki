const _ = require('underscore');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/draw': this.draw,
            '/power': this.power,
            '/kill': this.kill,
            '/blank': this.blank,
            '/unblank': this.unblank,
            '/add-trait': this.addTrait,
            '/remove-trait': this.removeTrait,
            '/add-keyword': this.addKeyword,
            '/remove-keyword': this.removeKeyword,
            '/discard': this.discard,
            '/pillage': this.pillage,
            '/strength': this.strength,
            '/str': this.strength,
            '/give-icon': this.addIcon,
            '/add-icon': this.addIcon,
            '/take-icon': this.removeIcon,
            '/remove-icon': this.removeIcon,
            '/give-control': this.giveControl,
            '/reset-challenges-count': this.resetChallengeCount,
            '/cancel-prompt': this.cancelPrompt,
            '/token': this.setToken,
            '/bestow': this.bestow,
            '/disconnectme': this.disconnectMe
        };
        this.tokens = [
            'power',
            'gold',
            'valarmorghulis',
            'stand',
            'poison',
            'betrayal',
            'vengeance',
            'ear',
            'venom'
        ];
    }

    executeCommand(player, command, args) {
        if(!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    draw(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

        player.drawCardsToHand(num);
    }

    power(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set power for',
            waitingPromptTitle: 'Waiting for opponent to set power',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.modifyPower(num - card.power);

                this.game.addMessage('{0} uses the /power command to set the power of {1} to {2}', p, card, num);
                return true;
            }
        });
    }

    kill(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to kill character',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.controller.killCharacter(card);

                this.game.addMessage('{0} uses the /kill command to kill {1}', p, card);
                return true;
            }
        });
    }

    blank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to blank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.setBlank();

                this.game.addMessage('{0} uses the /blank command to blank {1}', p, card);
                return true;
            }
        });
    }

    unblank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to unblank card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.clearBlank();

                this.game.addMessage('{0} uses the /unblank command to remove the blank condition from {1}', p, card);
                return true;
            }
        });
    }

    addTrait(player, args) {
        var trait = args[1];

        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add trait to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addTrait(trait);

                this.game.addMessage('{0} uses the /add-trait command to add the {1} trait to {2}', p, trait, card);
                return true;
            }
        });
    }

    removeTrait(player, args) {
        var trait = args[1];
        if(!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to remove trait remove card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeTrait(trait);

                this.game.addMessage('{0} uses the /remove-trait command to remove the {1} trait from {2}', p, trait, card);
                return true;
            }
        });
    }

    addKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addKeyword(keyword);

                this.game.addMessage('{0} uses the /add-keyword command to add the {1} keyword to {2}', p, keyword, card);
                return true;
            }
        });
    }

    removeKeyword(player, args) {
        var keyword = args[1];
        if(!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeKeyword(keyword);

                this.game.addMessage('{0} uses the /remove-keyword command to remove the {1} keyword from {2}', p, keyword, card);
                return true;
            }
        });
    }

    discard(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /discard command to discard {1} card{2} at random', player, num, num > 1 ? 's' : '');

        player.discardAtRandom(num);
    }

    pillage(player) {
        this.game.addMessage('{0} uses the /pillage command to discard 1 card from the top of their draw deck', player);

        player.discardFromDraw(1, discarded => {
            this.game.addMessage('{0} discards {1} due to Pillage', player, discarded);
        });
    }

    strength(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set strength for',
            waitingPromptTitle: 'Waiting for opponent to set strength',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.strengthModifier = num - card.cardData.strength;
                this.game.addMessage('{0} uses the /strength command to set the strength of {1} to {2}', p, card, num);
                return true;
            }
        });
    }

    addIcon(player, args) {
        var icon = args[1];

        if(!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give icon',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.addIcon(icon);
                this.game.addMessage('{0} uses the /give-icon command to give {1} a {2} icon', p, card, icon);

                return true;
            }
        });
    }

    removeIcon(player, args) {
        var icon = args[1];

        if(!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to remove icon',
            cardCondition: card => card.location === 'play area' && card.controller === player && card.getType() === 'character',
            onSelect: (p, card) => {
                card.removeIcon(icon);
                this.game.addMessage('{0} uses the /take-icon command to remove a {1} icon from {2}', p, icon, card);

                return true;
            }
        });
    }

    giveControl(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give control',
            cardCondition: card => ['play area', 'discard pile', 'dead pile'].includes(card.location) && card.controller === player,
            onSelect: (p, card) => {
                var otherPlayer = this.game.getOtherPlayer(player);
                if(!otherPlayer) {
                    return true;
                }

                this.game.takeControl(otherPlayer, card);
                this.game.addMessage('{0} uses the /give-control command to pass control of {1} to {2}', p, card, otherPlayer);

                return true;
            }
        });
    }

    resetChallengeCount(player) {
        player.challenges.reset();
        this.game.addMessage('{0} uses /reset-challenges-count to reset the number of challenges performed', player);
    }

    cancelPrompt(player) {
        this.game.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
        this.game.pipeline.cancelStep();
    }

    setToken(player, args) {
        var token = args[1];
        var num = this.getNumberOrDefault(args[2], 1);

        if(!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: card => (card.location === 'play area' || card.location === 'plot') && card.controller === player,
            onSelect: (p, card) => {
                var numTokens = card.tokens[token] || 0;

                card.addToken(token, num - numTokens);
                this.game.addMessage('{0} uses the /token command to set the {1} token count of {2} to {3}', p, token, card, num - numTokens);

                return true;
            }
        });
    }

    bestow(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        if(player.gold < num) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to bestow ' + num + ' gold',
            waitingPromptTitle: 'Waiting for opponent to bestow',
            cardCondition: card => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                player.gold -= num;

                card.addToken('gold', num);
                this.game.addMessage('{0} uses the /bestow command to add {1} gold to {2}', p, num, card);

                return true;
            }
        });
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidIcon(icon) {
        if(!icon) {
            return false;
        }

        var lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    isValidToken(token) {
        if(!token) {
            return false;
        }

        var lowerToken = token.toLowerCase();

        return _.contains(this.tokens, lowerToken);
    }
}

module.exports = ChatCommands;
