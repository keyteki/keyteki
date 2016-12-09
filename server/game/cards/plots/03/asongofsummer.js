const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ASongOfSummer extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onPlotFlip']);
    }

    onPlotFlip() {
        if(this.controller.selectedPlot !== this) {
            return;
        }
        
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer || !otherPlayer.selectedPlot.hasTrait('Winter')) {
            this.controller.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier++;
                }
            });
        }
    }

    onCardPlayed(e, player, cardId) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);
        if(!card) {
            return;
        }

        if(card.getType() === 'character') {
            card.strengthModifier++;
        }
    }

    leavesPlay() {
        super.leavesPlay();
        
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer || (otherPlayer.activePlot && !otherPlayer.activePlot.hasTrait('Winter'))) {
            this.controller.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier--;
                }
            });
        }
    }
}

ASongOfSummer.code = '03050';

module.exports = ASongOfSummer;
