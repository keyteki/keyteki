const Card = require('../../Card.js');

class Mother extends Card {
    // During your draw cards step, refill your hand to 1 additional card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

Mother.id = 'mother';

module.exports = Mother;
