const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class DesertScavenger extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'martell');
    }
}

DesertScavenger.code = '01110';

module.exports = DesertScavenger;
