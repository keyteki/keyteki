const Card = require('../../Card.js');

class SoulSnatcher extends Card {
    // Each time a creature is destroyed,
    // its owner gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) => event.card.type === 'creature'
            },
            effect: 'make {1} gain 1 amber due to {2} being destroyed',
            effectArgs: (context) => [context.event.card.owner, context.event.card],
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.card.owner
            }))
        });
    }
}

SoulSnatcher.id = 'soul-snatcher';

module.exports = SoulSnatcher;
