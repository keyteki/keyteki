const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheGreenblood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.isFaction('martell'),
            effect: ability.effects.dynamicStrength(() => this.numOfSummerPlotsRevealed())
        });
    }

    numOfSummerPlotsRevealed() {
        var plots = _.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Summer'));

        return plots.length;
    }
}

TheGreenblood.code = '04116';

module.exports = TheGreenblood;
