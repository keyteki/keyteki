const Card = require('../../Card.js');

class Nectarcyte extends Card {
    // After Fight/After Reap: Give Nectarcyte three +1 power counters.
    // You may move any number of +1 power counters from Nectarcyte to another friendly creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'give {0} three +1 power counters',
            gameAction: ability.actions.addPowerCounter({ amount: 3 }),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a number',
                    mode: 'options',
                    options: (context) =>
                        [
                            ...Array.from(
                                { length: context.source.powerCounters + 1 },
                                (v, k) => k
                            ).keys()
                        ].map((option) => ({ name: option, value: option }))
                },
                gameAction: ability.actions.removePowerCounter((context) => ({
                    amount: context.option ? context.option.value : 0,
                    target: context.source
                })),
                then: (preThenContext) => ({
                    target: {
                        cardType: 'creature',
                        controller: 'self',
                        cardCondition: (card) => card !== this,
                        gameAction: ability.actions.addPowerCounter({
                            amount: preThenContext.option.value
                        })
                    },
                    message: '{0} uses {1} to move {3} +1 power counters to {4}',
                    messageArgs: (context) => [preThenContext.option.value, context.target]
                })
            }
        });
    }
}

Nectarcyte.id = 'nectarcyte';

module.exports = Nectarcyte;
