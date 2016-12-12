const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ASongOfSummer extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onPlotFlip']);
    }

    onPlotFlip() {
        if(this.owner.selectedPlot !== this && this.owner.activePlot !== this) {
            return;
        }
       
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(this.owner.activePlot === this) {
            if(!otherPlayer || (otherPlayer.activePlot && !otherPlayer.activePlot.hasTrait('Winter'))) {
                this.owner.cardsInPlay.each(card => {
                    if(card.getType() === 'character') {
                        card.strengthModifier--;
                    }
                });
            }

            return;
        }

        if(!otherPlayer || !otherPlayer.selectedPlot.hasTrait('Winter')) {
            this.owner.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier++;
                }
            });
        }
    }

    onCardPlayed(e, player, cardId) {
        if(!this.inPlay || this.owner !== player) {
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
}

ASongOfSummer.code = '03050';

module.exports = ASongOfSummer;
