const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class TargaryenLoyalist extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'targaryen');
    }
}

TargaryenLoyalist.code = '01170';

module.exports = TargaryenLoyalist;
