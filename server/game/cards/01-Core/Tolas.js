const Card = require('../../Card.js');

class Tolas extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Each time a creature is destroyed,
    // its opponent gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) => event.clone.type === 'creature'
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.card.controller.opponent
            })),
            effect: 'make {1} gain 1 amber',
            effectArgs: (context) => context.event.card.controller.opponent
        });
    }
}

Tolas.id = 'tolas';

module.exports = Tolas;
