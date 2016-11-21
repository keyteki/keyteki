const FactionCharacterCostReducer = require('../../reducer.js').FactionCharacterCostReducer;

class DragonstoneFaithful extends FactionCharacterCostReducer {
    constructor(owner, cardData) {
        super(owner, cardData, 1, 'baratheon');
    }
}

DragonstoneFaithful.code = '01056';

module.exports = DragonstoneFaithful;
