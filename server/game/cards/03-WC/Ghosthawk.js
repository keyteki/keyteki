const Card = require('../../Card.js');

class Ghosthawk extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play: You may reap with each neighboring creature, one at a time.
    setupCardAbilities(ability) {
        this.play({
            effect: 'reap with each of its neighbors in turn',
            target: {
                optional: true,
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            },
            then: (preThenContext) => ({
                condition: () => !!preThenContext.target,
                alwaysTriggers: true,
                gameAction: (() => {
                    const firstWasLeft =
                        preThenContext.source.leftNeighbor() === preThenContext.target;

                    return ability.actions.reap(() => ({
                        target: firstWasLeft
                            ? preThenContext.source.rightNeighbor()
                            : preThenContext.source.leftNeighbor()
                    }));
                })()
            })
        });
    }
}

Ghosthawk.id = 'ghosthawk';

module.exports = Ghosthawk;
