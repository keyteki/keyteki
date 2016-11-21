const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class HeartTreeGrove extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'stark');
    }
}

HeartTreeGrove.code = '01156';

module.exports = HeartTreeGrove;
