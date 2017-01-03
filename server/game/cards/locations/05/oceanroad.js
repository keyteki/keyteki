const Reducer = require('../../reducer.js').Reducer;

class OceanRoad extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, (player, card) => {
            return card.getFaction() === 'neutral' || card.getFaction() !== this.controller.faction.getFaction();
        });
    }
}

OceanRoad.code = '05042';

module.exports = OceanRoad;
