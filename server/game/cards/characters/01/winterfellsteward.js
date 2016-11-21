const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class WinterfellSteward extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'stark');
    }
}

WinterfellSteward.code = '01152';

module.exports = WinterfellSteward;
