const Card = require('../../Card.js');

class SoulSnatcher extends Card {
    // After a creature is destroyed, its owner gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) => event.clone.type === 'creature'
            },
            effect: 'make {1} gain 1 amber due to {2} being destroyed',
            effectArgs: (context) => [context.event.card.owner, context.event.clone],
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.card.owner
            }))
        });
    }
}

SoulSnatcher.id = 'soul-snatcher';

module.exports = SoulSnatcher;
