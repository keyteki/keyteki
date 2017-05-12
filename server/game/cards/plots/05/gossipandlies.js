const PlotCard = require('../../../plotcard.js');

class GossipAndLies extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character',
            condition: () => this.isAttackingInFirstIntrigueChallenge(),
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    isAttackingInFirstIntrigueChallenge() {
        var currentChallenge = this.game.currentChallenge;

        return currentChallenge &&
                currentChallenge.challengeType === 'intrigue' &&
                currentChallenge.attackingPlayer === this.controller &&
                this.controller.getNumberOfChallengesInitiatedByType('intrigue') === 0;
    }
}

GossipAndLies.code = '05050';

module.exports = GossipAndLies;
