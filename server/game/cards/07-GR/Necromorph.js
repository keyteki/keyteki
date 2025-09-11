const Card = require('../../Card.js');

class Necromorph extends Card {
    // Destroyed: If Necromorph has a non-Star Alliance neighbor,
    // fully heal Necromorph and destroy that neighbor instead.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) =>
                context.source.neighbors.some((card) => !card.hasHouse('staralliance')),
            target: {
                cardCondition: (card, context) =>
                    context.source.neighbors.includes(card) && !card.hasHouse('staralliance')
            },
            effect: 'heal all damage from {1} and destroy {0} instead',
            effectArgs: () => this,
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    card: this,
                    postHandler: (context) => (context.source.moribund = false)
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event.triggeringEvent,
                    destroyedByDamageDealt: false,
                    destroyedFighting: false,
                    card: context.target
                }))
            ]
        });
    }
}

Necromorph.id = 'necromorph';

module.exports = Necromorph;
