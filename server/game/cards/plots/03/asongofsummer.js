const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ASongOfSummer extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        var otherPlayer = this.game.getOtherPlayer(this.owner);

        if(!otherPlayer) {
            return;
        }

        if(!otherPlayer.selectedPlot.hasTrait('Winter')) {
            this.owner.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier++;
                }
            });
        }
    }

    leavesPlay() {
        var otherPlayer = this.game.getOtherPlayer(this.owner);

        if(!otherPlayer) {
            return;
        }

        if(otherPlayer.activePlot && !otherPlayer.activePlot.hasTrait('Winter')) {
            this.owner.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier;
                }
            });
        }
    }
}

ASongOfSummer.code = '03050';

module.exports = ASongOfSummer;
