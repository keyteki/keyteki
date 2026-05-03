const GiganticCard = require('../../GiganticCard.js');

class Zomok2 extends GiganticCard {
    // (Play only with the other half of Zomok.)
    // While Zomok is attacking, ignore taunt, elusive, poison, hazardous, and invulnerable.
    // After Fight: Deal 2 damage to a creature for each forged key.
    constructor(owner, cardData) {
        super(owner, cardData);
    }
}

Zomok2.id = 'zomok2';

module.exports = Zomok2;
