const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class StewardAtTheWall extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'thenightswatch');
    }
}

StewardAtTheWall.code = '01133';

module.exports = StewardAtTheWall;
