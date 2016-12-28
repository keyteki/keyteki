const PlotCard = require('../../../plotcard.js');

class TradingWithThePentoshi extends PlotCard {
    onReveal(player) {
        if(this.controller !== player) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(player);

        if(otherPlayer) {
            otherPlayer.gold += 3;

            this.game.addMessage('{0} gains 3 gold from {1}\'s {2}', otherPlayer, player, this);
        }

        return true;
    }
}

TradingWithThePentoshi.code = '02039';

module.exports = TradingWithThePentoshi;
