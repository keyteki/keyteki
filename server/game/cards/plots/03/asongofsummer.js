const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ASongOfSummer extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed']);
    }

    flipFaceup() {
        super.flipFaceup();

        var otherPlayer = this.game.getOtherPlayer(this.owner);

        if(!otherPlayer || !otherPlayer.selectedPlot.hasTrait('Winter')) {
            this.owner.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier++;
                }
            });
        }
    }

    onCardPlayed(player, cardId) {
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

    leavesPlay() {
        var otherPlayer = this.game.getOtherPlayer(this.owner);

        if(!otherPlayer || (otherPlayer.activePlot && !otherPlayer.activePlot.hasTrait('Winter'))) {
            this.owner.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.strengthModifier--;
                }
            });
        }
    }
}

ASongOfSummer.code = '03050';

module.exports = ASongOfSummer;
