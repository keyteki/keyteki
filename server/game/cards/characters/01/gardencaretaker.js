const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class GardenCaretaker extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'tyrell');
    }
}

GardenCaretaker.code = '01188';

module.exports = GardenCaretaker;
