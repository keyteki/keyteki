const PlotCard = require('../../../plotcard.js');

class NavalSuperiority extends PlotCard {
    modifyIncome(player, income) {
        if(player.activePlot.hasTrait('Kingdom') || player.activePlot.hasTrait('Edict')) {
            this.game.addMessage('{0} uses {1} to treat the gold value of {2} as if it were 0', this.controller, this, player.activePlot);

            return income - player.activePlot.getIncome();
        }

        return income;
    }
}

NavalSuperiority.code = '01017';

module.exports = NavalSuperiority;
