const Card = require('../../Card.js');

class Munchling extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: You may discard a Logos card from your hand or archives. If you do, gain 1A.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            target: {
                location: ['archives', 'hand'],
                cardCondition: (card) => card.hasHouse('logos'),
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Munchling.id = 'munchling';

module.exports = Munchling;
