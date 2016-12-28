const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class EuronCrowsEye extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

//        this.registerEvents(['onPillage']);
    }

    onPillage(event, challenge, card) {
        var player = challenge.winner;
        if(this.controller !== player || card !== this) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    cardCondition(card) {
        return false;
    }

    onCardSelected(player, card) {
        return true;
    }

    trigger(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select location',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cancel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

EuronCrowsEye.code = '01069';

module.exports = EuronCrowsEye;
