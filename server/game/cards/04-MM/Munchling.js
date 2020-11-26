const Card = require('../../Card.js');

class Munchling extends Card {
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
