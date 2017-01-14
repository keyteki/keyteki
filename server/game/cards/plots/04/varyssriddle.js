const PlotCard = require('../../../plotcard.js');

class VaryssRiddle extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(this.resolving || !otherPlayer) {
                    return;
                }

                var plot = otherPlayer.activePlot;
                if(plot.hasTrait('Riddle')) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to initiate the when resolved effect of {2}', this.controller, this, plot);
                plot.controller = this.controller;
                this.resolving = true;
                this.game.raiseEvent('onPlotRevealed', this.controller);
                this.resolving = false;
                plot.controller = plot.owner;
            }
        });
    }
}

VaryssRiddle.code = '04020';

module.exports = VaryssRiddle;
