const Card = require('../../Card.js');

class Neffru extends Card {
    // Each time a creature is destroyed,
    // its owner gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.type === 'creature' && event.card !== context.source
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.card.controller
            })),
            effect: 'make {1} gain 1 amber',
            effectArgs: (context) => context.event.card.controller
        });
    }
}

Neffru.id = 'neffru';

module.exports = Neffru;
