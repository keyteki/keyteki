const DrawCard = require('../../../drawcard.js');

class TheHauntedForest extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                !this.kneeled &&
                this.game.currentChallenge &&
                this.game.currentChallenge.defendingPlayer === this.controller
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(1)
        });
        this.forcedReaction({
            when: {
                afterChallenge: (e, challenge) => this.controller === challenge.loser && !this.kneeled
            },
            handler: () => {
                this.game.addMessage('{0} is forced to kneel {1} because they lost a challenge', this.controller, this);
                this.controller.kneelCard(this);
            }
        });
    }
}

TheHauntedForest.code = '04066';

module.exports = TheHauntedForest;
