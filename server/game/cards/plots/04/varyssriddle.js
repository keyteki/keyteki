const PlotCard = require('../../../plotcard.js');

class VaryssRiddle extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let player = this.controller;
                let otherPlayer = this.game.getOtherPlayer(player);
                if(this.resolving || !otherPlayer) {
                    return;
                }

                let plot = otherPlayer.activePlot;
                if(plot.hasTrait('Riddle')) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to initiate the When Revealed ability of {2}', player, this, plot);
                plot.controller = player;
                this.resolving = true;

                this.game.raiseMergedEvent('onPlotsWhenRevealed', { plots: [plot] });
                this.game.queueSimpleStep(() => {
                    this.resolving = false;
                    plot.controller = plot.owner;
                });
            }
        });
    }
}

VaryssRiddle.code = '04020';

module.exports = VaryssRiddle;
