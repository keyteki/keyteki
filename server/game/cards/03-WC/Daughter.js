const Card = require('../../Card.js');

class Daughter extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // During your draw cards step, refill your hand to 1 additional card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

Daughter.id = 'daughter';

module.exports = Daughter;
