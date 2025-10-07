import Card from '../../Card.js';

class Monsquito extends Card {
    // After Fight: Fully heal Monsquito. Deal 2D to a creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.heal({ fully: true }),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            }
        });
    }
}

Monsquito.id = 'monsquito';

export default Monsquito;
