const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class RoseGarden extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

RoseGarden.code = '01194';

module.exports = RoseGarden;
