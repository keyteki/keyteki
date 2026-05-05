const TheGoldenQueen = require('./TheGoldenQueen.js');

class TheGoldenQueen2 extends TheGoldenQueen {
    // (Play only with the other half of The Golden Queen.)
    // Each player refills their hand to 1 additional card during their "draw cards" step.
    // After Fight/After Reap: Each player discards a random card from their hand. For each non-Ekwidon card discarded this way, gain 1A.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

TheGoldenQueen2.id = 'the-golden-queen2';

module.exports = TheGoldenQueen2;
