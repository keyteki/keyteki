const DrawCard = require('../../../drawcard.js');

class InTheNameOfYourKing extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'End challenge',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military' && this.game.currentChallenge.defendingPlayer === this.controller,
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.currentChallenge.cancelChallenge();
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.cannotInitiateChallengeType('military')
                }));

                this.game.addMessage('{0} uses {1} to end this challenge with no winner or loser',
                                    this.controller, this);
            }
        });
    }
}

InTheNameOfYourKing.code = '02028';

module.exports = InTheNameOfYourKing;
