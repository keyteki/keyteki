import Card from '../../Card.js';

class Thundertow extends Card {
    // Play: Exhaust 2 creatures. Deal 2D to each exhausted creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.exhausted),
                    amount: 2
                })),
                message: '{0} uses {1} to deal damage to each exhausted creature'
            }
        });
    }
}

Thundertow.id = 'thundertow';

export default Thundertow;
