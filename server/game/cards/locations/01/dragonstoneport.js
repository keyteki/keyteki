const FactionCostReducer = require('../../reducer.js').FactionCostReducer;

class DragonstonePort extends FactionCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstonePort.code = '01059';

module.exports = DragonstonePort;
