const DrawCard = require('../../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onRenown: (event, challenge, card) => card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(this.game.currentChallenge, card),
                    activePromptTitle: 'Select character to gain power',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(challenge, card) {
        return card !== this && card.getType() === 'character' && challenge.isParticipating(card);
    }

    onCardSelected(player, card) {
        if(this.isBlank() || this.controller !== player) {
            return;
        }

        card.modifyPower(1);

        this.game.addMessage('{0} uses {1} to allow {2} to gain 1 power', player, this, card);

        return true;
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
