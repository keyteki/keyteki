const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Rhaegal extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge', 'onPhaseStarted']);
    }

    onPhaseStarted() {
        this.abilityUsed = false;
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || this.abilityUsed || this.isBlank()) {
            return;
        }

        if(!_.any(challenge.getWinnerCards(), card => {
            return card.hasTrait('Stormborn');
        })) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'stand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });         
    }

    stand(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Stormborn'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        player.standCard(card);
        this.abilityUsed = true;

        this.game.addMessage('{0} uses {1} to stand {2}', player, this, card);

        return true;
    }
}

Rhaegal.code = '01164';

module.exports = Rhaegal;
