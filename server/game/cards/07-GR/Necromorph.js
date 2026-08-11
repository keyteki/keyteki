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
            gameAction: ability.actions.replaceDestruction({
                gameAction: [
                    ability.actions.heal({ fully: true }),
                    ability.actions.destroy((context) => ({ target: context.target }))
                ]
            })
        });
    }
}

Necromorph.id = 'necromorph';

module.exports = Necromorph;
