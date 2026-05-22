const Card = require('../../Card.js');

class Camaraderie extends Card {
    // Play: Exhaust a friendly Star Alliance creature. If you do,
    // draw 2 cards for each of its non-Star Alliance neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('staralliance'),
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => ({
                condition: () => !!preThenContext.target,
                gameAction: ability.actions.draw({
                    amount: preThenContext.target
                        ? 2 *
                          preThenContext.target.neighbors.filter((c) => !c.hasHouse('staralliance'))
                              .length
                        : 0
                })
            })
        });
    }
}

Camaraderie.id = 'camaraderie';

module.exports = Camaraderie;
