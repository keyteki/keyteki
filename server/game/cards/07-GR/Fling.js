import Card from '../../Card.js';

class Fling extends Card {
    // Play: Destroy a friendly creature. If you do, deal damage to an
    // enemy creature equal to the destroyed creature’s power with 3
    // splash.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.preThenEvents[0].clone.modifiedPower,
                        splash: 3
                    }))
                },
                message: '{0} uses {1} to deal {3} damage to {4} with 3 splash',
                messageArgs: (context) => [
                    context.preThenEvents[0].clone.modifiedPower,
                    context.target
                ]
            }
        });
    }
}

Fling.id = 'fling';

export default Fling;
