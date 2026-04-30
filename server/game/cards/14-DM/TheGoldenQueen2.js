const GiganticCard = require('../../GiganticCard.js');

class TheGoldenQueen2 extends GiganticCard {
    // (Play only with the other half of The Golden Queen.) Top half - art only.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
    }
}

TheGoldenQueen2.id = 'the-golden-queen2';

module.exports = TheGoldenQueen2;
