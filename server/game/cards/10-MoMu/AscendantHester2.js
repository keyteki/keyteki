const AscendantHester = require('./AscendantHester.js');

class AscendantHester2 extends AscendantHester {
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

AscendantHester2.id = 'ascendant-hester2';

module.exports = AscendantHester2;
