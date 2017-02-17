const PlotCard = require('../../../plotcard.js');

class SummerHarvest extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return true;
                }

                this.baseIncome = otherPlayer.activePlot.getIncome(true) + 2;
            }
        });
    }
}

SummerHarvest.code = '04039';

module.exports = SummerHarvest;
