const PlotCard = require('../../../plotcard.js');

class BattleOfOxcross extends PlotCard {

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge
                && this.game.currentChallenge.attackingPlayer === this.controller
                && this.game.currentChallenge.attackingPlayer.getNumberOfChallengesInitiated() <= 1,
            match: (card) =>
                card.getType() === 'character'
                && card.getCost() >= 4,
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }

}

BattleOfOxcross.code = '04060';

module.exports = BattleOfOxcross;
