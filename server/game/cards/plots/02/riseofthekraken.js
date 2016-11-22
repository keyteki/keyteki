const PlotCard = require('../../../plotcard.js');

class RiseOfTheKraken extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin']);
    }

    onUnopposedWin(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.game.addMessage('{0} uses {1} to gain an additional power from winning an unopposed challenge', player, this);

        this.game.addPower(player, 1);
    }
}

RiseOfTheKraken.code = '02012';

module.exports = RiseOfTheKraken;
