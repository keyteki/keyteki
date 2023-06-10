const Card = require('../../Card.js');

class BerserkerSlam extends Card {
    // Play: Deal 4D to a flank creature. If this damage destroys that creature, its controller loses 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.preThenEvent.clone.controller
                })),
                message: '{0} uses {1} to cause {3} to lose 1 amber',
                messageArgs: (context) => [context.preThenEvent.clone.controller]
            }
        });
    }
}

BerserkerSlam.id = 'berserker-slam';

module.exports = BerserkerSlam;
