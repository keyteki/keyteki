const Card = require('../../Card.js');

class HammerSmythe extends Card {
    // After Reap: Deal 2 to a creature. If this damage destroys that
    // creature, give a friendly creature two +1 power counters.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: () => ({
                alwaysTriggers: true,
                condition: (context) =>
                    !!context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.addPowerCounter({ amount: 2 })
                },
                message: '{0} uses {1} to give two +1 power counters to {2}'
            })
        });
    }
}

HammerSmythe.id = 'hammer-smythe';

module.exports = HammerSmythe;
