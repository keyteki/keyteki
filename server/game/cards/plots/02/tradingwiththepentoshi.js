const PlotCard = require('../../../plotcard.js');

class TradingWithThePentoshi extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(otherPlayer) {
                    this.game.addGold(otherPlayer, 3);
                    this.game.addMessage('{0} gains 3 gold from {1}\'s {2}', otherPlayer, this.controller, this);
                }
            }
        });
    }
}

TradingWithThePentoshi.code = '02039';

module.exports = TradingWithThePentoshi;
