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
            then: (preThenContext) => ({
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
                effect: 'give two +1 power counters to {0}',
                effectArgs: () => [preThenContext.target]
            })
        });
    }
}

HammerSmythe.id = 'hammer-smythe';

module.exports = HammerSmythe;
