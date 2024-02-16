const Card = require('../../Card.js');

class LiftingBuddy extends Card {
    // Play/After Fight/After Reap: Give Lifting Buddy two +1 power counters.
    // Give another friendly creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.source,
                amount: 2
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card, context) => card != context.source,
                    gameAction: ability.actions.addPowerCounter({
                        amount: 2
                    })
                },
                message: '{0} uses {1} to place 2 +1 power counters on {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

LiftingBuddy.id = 'lifting-buddy';

module.exports = LiftingBuddy;
