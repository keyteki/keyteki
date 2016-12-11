const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class CountingCoppers extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        _.each(this.game.getPlayers(), player => {
            player.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.setBlank();
                }
            });
        });
    }

    leavesPlay() {
        super.leavesPlay();
        
        _.each(this.game.getPlayers(), player => {
            player.cardsInPlay.each(card => {
                if(card.getType() === 'character') {
                    card.clearBlank();
                }
            });
        });
    }
}

CountingCoppers.code = '01012';

module.exports = CountingCoppers;
