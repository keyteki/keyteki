const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

class KillCharacterPrompt extends UiPrompt {
    constructor(game, choosingPlayer, cardCondition, events) {
        super(game);
        this.choosingPlayer = choosingPlayer;
        this.cardCondition = cardCondition;
        this.events = events;
        _.defaults(this.events, this.defaultEvents());
    }

    defaultEvents() {
        return {
            onKill: () => true,
            onCancel: () => true
        };
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        return {
            selectCard: true,
            menuTitle: 'Select character to kill',
            buttons: [
                { command: 'menuButton', text: 'Cancel' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to kill a character' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(card.getType() !== 'character' || !this.cardCondition(card)) {
            return false;
        }

        card.controller.killCharacter(card);
        this.events.onKill(card);
        this.complete();
    }

    onMenuCommand(player) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        this.events.onCancel();
        this.complete();
    }
}

module.exports = KillCharacterPrompt;
