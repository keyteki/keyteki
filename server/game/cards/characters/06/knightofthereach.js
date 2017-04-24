const DrawCard = require('../../../drawcard.js');

class KnightOfTheReach extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.isParticipating(this) &&
                    this.hasSingleParticipatingChar())
            },
            target: {
                activePromptTitle: 'Select a Lady',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.hasTrait('Lady') &&
                    card.getType() === 'character')
            },
            handler: context => {
                context.target.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', 
                                      this.controller, this, context.target);
            }
        });
    }

    hasSingleParticipatingChar() {
        if(this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }
}

KnightOfTheReach.code = '06023';

module.exports = KnightOfTheReach;
