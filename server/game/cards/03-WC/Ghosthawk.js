const Card = require('../../Card.js');

class Ghosthawk extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'reap with each of its neighbors in turn',
            target: {
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            },
            then: (preThenContext) => ({
                alwaysTrigger: true,
                gameAction: ability.actions.reap((context) => ({
                    target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                        (c) => c !== context.preThenEvent.card
                    )
                }))
            })
        });
    }
}

Ghosthawk.id = 'ghosthawk';

module.exports = Ghosthawk;
