const Card = require('../../Card.js');

class ProfEmeritusKering extends Card {
    // Deploy.
    // (T) Play/Fight/Reap: Use 1 of Prof. Emeritus Kering's neighbors. If the tide is high, also use Prof. Emeritus Kering's other neighbor.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            effect: 'use its neighbors',
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.use()
            },
            then: (preThenContext) => ({
                condition: (context) => context.player.isTideHigh(),
                alwaysTriggers: true,
                gameAction: ability.actions.use((context) => ({
                    target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                        (c) => c !== context.preThenEvent.card
                    )
                }))
            })
        });
    }
}

ProfEmeritusKering.id = 'prof-emeritus-kering';

module.exports = ProfEmeritusKering;
