const PlotCard = require('../../../plotcard.js');

class CountingCoppers extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.controller.drawCardsToHand(3);
                this.game.addMessage('{0} uses {1} to draw 3 cards to hand', this.controller, this);
            }
        });
    }
}

CountingCoppers.code = '01010';

module.exports = CountingCoppers;
