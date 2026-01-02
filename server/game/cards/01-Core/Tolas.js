const Card = require('../../Card.js');

class Tolas extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // After a creature is destroyed, its opponent gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) => event.clone.type === 'creature'
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.clone.controller.opponent
            })),
            effect: 'make {1} gain 1 amber due to {2} being destroyed',
            effectArgs: (context) => [context.event.clone.controller.opponent, context.event.clone]
        });
    }
}

Tolas.id = 'tolas';

module.exports = Tolas;
