const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class IronIslandsFishmonger extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'greyjoy');
    }
}

IronIslandsFishmonger.code = '01074';

module.exports = IronIslandsFishmonger;
