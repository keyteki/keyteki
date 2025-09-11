const Card = require('../../Card.js');

class Synchronizer extends Card {
    // Each friendly Clock creature gains, “Destroyed: Move half the time
    // counters (rounding up) from this creature to Synchronizer.”
    //
    // Omni: Move all time counters on Synchronizer to a friendly Clock
    // creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('clock'),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.addTimeCounter((context) => ({
                    target: this,
                    amount: Math.ceil(context.source.tokens['time'] * 0.5)
                }))
            })
        });

        this.omni({
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('clock'),
                gameAction: [
                    ability.actions.addTimeCounter((context) => ({
                        amount: context.source.tokens['time']
                    })),
                    ability.actions.removeTimeCounter((context) => ({
                        target: context.source,
                        amount: context.source.tokens['time']
                    }))
                ]
            }
        });
    }
}

Synchronizer.id = 'synchronizer';

module.exports = Synchronizer;
