const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class LannisportMerchant extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'lannister');
    }
}

LannisportMerchant.code = '01094';

module.exports = LannisportMerchant;
