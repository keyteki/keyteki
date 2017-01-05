const Reducer = require('../../reducer.js').Reducer;

class OceanRoad extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, (player, card) => {
            return card.getFaction() === 'neutral' || card.getFaction() !== this.controller.faction.getFaction();
        });
    }

    onClick(player) {
        var ret = super.onClick(player);

        if(!ret || this.isBlank()) {
            return false;
        }

        this.game.addMessage('{0} kneels {1} to reduce the cost of the next neutral or out of faction card marshalled by 1', player, this);

        return ret;
    }
}

OceanRoad.code = '05042';

module.exports = OceanRoad;
