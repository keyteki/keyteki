import Card from '../../Card.js';

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
                gameAction: ability.actions.draw({
                    amount:
                        2 *
                        preThenContext.target.neighbors.filter((c) => !c.hasHouse('staralliance'))
                            .length
                })
            })
        });
    }
}

Camaraderie.id = 'camaraderie';

export default Camaraderie;
