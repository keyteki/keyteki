const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class SeaTower extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

SeaTower.code = '01080';

module.exports = SeaTower;
