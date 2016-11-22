const PlotCard = require('../../../plotcard.js');

class CountingCoppers extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        player.drawCardsToHand(3);

        this.game.addMessage('{0} uses {1} to draw 3 cards to hand', player, this);

        return true;
    }
}

CountingCoppers.code = '01010';

module.exports = CountingCoppers;
