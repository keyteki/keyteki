const GiganticCard = require('../../GiganticCard.js');

class Gigantor2 extends GiganticCard {
    // (Play only with the other half of Gigantor.)
    // After Fight/After Reap: Purge up to 3 cards from a discard pile. For each card purged this way, draw a card.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

Gigantor2.id = 'gigantor2';

module.exports = Gigantor2;
