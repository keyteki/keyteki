const PlotCard = require('../../../plotcard.js');

class ForTheWatch extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.defendingPlayer === this.controller &&
                this.game.currentChallenge.attackingPlayer.getNumberOfChallengesInitiated() <= 1
            ),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotWinChallenge()
        });
    }
}

ForTheWatch.code = '02067';

module.exports = ForTheWatch;
