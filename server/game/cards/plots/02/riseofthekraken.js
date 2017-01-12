const PlotCard = require('../../../plotcard.js');

class RiseOfTheKraken extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onUnopposedWin: (e, challenge) => challenge.winner === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain an additional power from winning an unopposed challenge', this.controller, this);
                this.game.addPower(this.controller, 1);
            }
        });
    }
}

RiseOfTheKraken.code = '02012';

module.exports = RiseOfTheKraken;
