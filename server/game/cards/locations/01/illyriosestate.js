const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class IllyriosEstate extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

IllyriosEstate.code = '01175';

module.exports = IllyriosEstate;
