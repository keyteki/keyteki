const DrawCard = require('../../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onRenown: (event, challenge, card) => card === this
            },
            target: {
                activePromptTitle: 'Select character to gain power',
                cardCondition: card => this.cardCondition(this.game.currentChallenge, card)
            },
            handler: context => {
                context.target.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', this.controller, this, context.target);
            }
        });
    }

    cardCondition(challenge, card) {
        return card !== this && card.controller === this.controller && card.getType() === 'character' && challenge.isParticipating(card);
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
