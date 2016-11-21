const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class WesternFiefdom extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

WesternFiefdom.code = '01099';

module.exports = WesternFiefdom;
