const _ = require('underscore');
const GameActions = require('./GameActions');
const ManualModePrompt = require('./gamesteps/ManualModePrompt');
const Deck = require('./deck');
const RematchPrompt = require('./gamesteps/RematchPrompt');

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/active-house': this.activeHouse,
            '/add-card': this.addCard,
            '/cancel-prompt': this.cancelPrompt,
            '/disconnectme': this.disconnectMe,
            '/draw': this.draw,
            '/discard': this.discard,
            '/forge': this.forge,
            '/manual': this.manual,
            '/modify-clock': this.modifyClock,
            '/mute-spectators': this.muteSpectators,
            '/rematch': this.rematch,
            '/stop-clocks': this.stopClocks,
            '/start-clocks': this.startClocks,
            '/token': this.setToken,
            '/unforge': this.unforge
        };
        this.tokens = [
            'amber',
            'damage',
            'power',
            'stun'
        ];
        this.houses = [
            'brobnar',
            'dis',
            'logos',
            'mars',
            'sanctum',
            'shadows',
            'untamed',
            'none'
        ];
    }

    executeCommand(player, command, args) {
        if(!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    addCard(player, args) {
        let cardName = args.slice(1).join(' ');
        let card = Object.values(this.game.cardData).find(c => {
            return c.name.toLowerCase() === cardName.toLowerCase();
        });

        if(!card) {
            return false;
        }

        let deck = new Deck();
        let preparedCard = deck.createCard(player, card);

        preparedCard.applyAnyLocationPersistentEffects();

        player.moveCard(preparedCard, 'deck');

        this.game.allCards.push(preparedCard);

        this.game.addAlert('danger', '{0} uses the /add-card command to add {1} to their deck', player, preparedCard);

        return true;
    }

    forge(player) {
        if(player.keys === 3) {
            return;
        }

        this.game.addMessage('{0} uses the /forge command to forge a key', player);
        player.keys += 1;
    }

    unforge(player) {
        if(player.keys === 0) {
            return;
        }
        this.game.addMessage('{0} uses the /unforge command to unforge a key', player);
        player.keys -= 1;
    }

    activeHouse(player, args) {
        let house = args[1];
        if(!house) {
            return;
        } else if(!player.activeHouse) {
            this.game.addMessage('{0} attempted to change their active house with /active-house, but they cannot have an active house currently', player, house);
        } else if(!this.houses.includes(house.toLowerCase())) {
            this.game.addMessage('{0} attempted to change their active house with /active-house, but {1} is not a valid house', player, house);
        } else {
            this.game.addMessage('{0} manually changed their active house to {1}', player, house);
            player.activeHouse = house.toLowerCase();
        }
    }

    startClocks(player) {
        this.game.addMessage('{0} restarts the timers', player);
        _.each(this.game.getPlayers(), player => player.clock.restart());
    }

    stopClocks(player) {
        this.game.addMessage('{0} stops the timers', player);
        _.each(this.game.getPlayers(), player => player.clock.pause());
    }

    modifyClock(player, args) {
        let num = this.getNumberOrDefault(args[1], 60);
        this.game.addMessage('{0} adds {1} seconds to their clock', player, num);
        player.clock.modify(num);
    }

    draw(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

        player.drawCardsToHand(num);
    }

    discard(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /discard command to discard {1} card{2} at random', player, num, num > 1 ? 's' : '');

        GameActions.discardAtRandom({ amount: num }).resolve(player, this.game.getFrameworkContext());
    }

    cancelPrompt(player) {
        this.game.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
        this.game.pipeline.cancelStep();
        this.game.cancelPromptUsed = true;
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
            cardCondition: card => (card.location === 'play area') && card.controller === player,
            onSelect: (p, card) => {
                var numTokens = card.tokens[token] || 0;

                card.addToken(token, num - numTokens);
                this.game.addMessage('{0} uses the /token command to set the {1} token count of {2} to {3}', p, token, card, num - numTokens);

                return true;
            }
        });
    }

    reveal(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            cardCondition: card => card.facedown && card.controller === player,
            onSelect: (player, card) => {
                card.facedown = false;
                this.game.addMessage('{0} reveals {1}', player, card);
                return true;
            }
        });
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }

    manual(player) {
        if(this.game.manualMode) {
            this.game.manualMode = false;
            this.game.addAlert('danger', '{0} switches manual mode off', player);
        } else {
            this.game.addAlert('danger', '{0} is attempting to switch manual mode on', player);
            this.game.queueStep(new ManualModePrompt(this.game, player));
        }
    }

    muteSpectators(player) {
        this.game.muteSpectators = !this.game.muteSpectators;

        this.game.addAlert('warning', '{0} {1}mutes spectators', player, this.game.muteSpectators ? '' : 'un');
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

    isValidToken(token) {
        if(!token) {
            return false;
        }

        var lowerToken = token.toLowerCase();

        return _.contains(this.tokens, lowerToken);
    }

    rematch(player) {
        if(this.game.finishedAt) {
            this.game.addAlert('info', '{0} is requesting a rematch', player);
        } else {
            this.game.addAlert('danger', '{0} is requesting a rematch.  The current game is not finished', player);
        }

        this.game.queueStep(new RematchPrompt(this.game, player));
    }
}

module.exports = ChatCommands;
