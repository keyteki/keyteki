const Card = require('../../Card.js');

class Necromorph extends Card {
    // Destroyed: If Necromorph has a non-Star Alliance neighbor,
    // fully heal Necromorph and destroy that neighbor instead.
    setupCardAbilities() {
        this.destroyed({
            condition: (context) =>
                context.source.neighbors.some((card) => !card.hasHouse('staralliance')),
            target: {
                cardCondition: (card, context) =>
                    context.source.neighbors.includes(card) && !card.hasHouse('staralliance')
            },
            handler: (context) => {
                const target = context.target;
                context.event.replacementHandler = (leavesPlayEvent) => {
                    const card = leavesPlayEvent.card;
                    card.removeToken('damage');
                    context.game.addMessage(
                        '{0} uses {1} to fully heal {1} and destroy {2} instead',
                        context.player,
                        context.source,
                        target
                    );
                    context.game.actions
                        .destroy()
                        .resolve(target, context.game.getFrameworkContext());
                };
            }
        });
    }
}

Necromorph.id = 'necromorph';

module.exports = Necromorph;
