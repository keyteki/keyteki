const Card = require('../../Card.js');

class UnleashTheBeast extends Card {
    // Play: Exhaust a friendly creature. If you do, deal damage equal to the exhausted creature's power to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.preThenEvents[0].clone.modifiedPower
                    }))
                },
                message: '{0} uses {1} to deal {3} damage to {4}',
                messageArgs: (context) => [
                    context.preThenEvents[0].clone.getPower(),
                    context.target
                ]
            }
        });
    }
}

UnleashTheBeast.id = 'unleash-the-beast';

module.exports = UnleashTheBeast;
