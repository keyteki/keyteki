const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class BloodOrangeGrove extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

BloodOrangeGrove.code = '01118';

module.exports = BloodOrangeGrove;
