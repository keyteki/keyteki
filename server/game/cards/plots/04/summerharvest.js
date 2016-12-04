const PlotCard = require('../../../plotcard.js');

class SummerHarvest extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        this.goldModifier += otherPlayer.activePlot.getIncome(true) + 2;

        return true;
    }
}

SummerHarvest.code = '04039';

module.exports = SummerHarvest;
