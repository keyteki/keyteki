const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class MoatCailin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.moreWinterThanSummerPlotsRevealed(),
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: [
                ability.effects.modifyInitiative(-3),
                ability.effects.modifyReserve(-1)
            ]
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        var winterPlots = _.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter'));
        var summerPlots = _.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Summer'));

        return winterPlots.length > summerPlots.length;
    }
}

MoatCailin.code = '06012';

module.exports = MoatCailin;
