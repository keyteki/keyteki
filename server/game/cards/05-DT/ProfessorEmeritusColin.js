const Card = require('../../Card.js');

class ProfessorEmeritusColin extends Card {
    // Deploy.
    // Play/Fight/Reap: Use one of this creature's neighbors. If the tide is high, use its other neighbor.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'use its neighbors',
            target: {
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.use()
            },
            then: (preThenContext) => ({
                condition: (context) => context.player.isTideHigh(),
                alwaysTrigger: true,
                gameAction: ability.actions.use((context) => ({
                    target: preThenContext.cardStateWhenInitiated.clonedNeighbors.filter(
                        (c) => c !== context.preThenEvent.card
                    )
                }))
            })
        });
    }
}

ProfessorEmeritusColin.id = 'professor-emeritus-colin';

module.exports = ProfessorEmeritusColin;
