const Card = require('../../Card.js');

class Chonkers extends Card {
    // Skirmish.
    // After an enemy creature is destroyed fighting Chonkers, double the number of +1 power counters on Chonkers.
    // Play: Give Chonkers a +1 power counter.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: [
                ability.actions.addPowerCounter((context) => ({
                    amount: context.source.tokens.power
                }))
            ]
        });

        this.play({
            gameAction: ability.actions.addPowerCounter({ amount: 1 })
        });
    }
}

Chonkers.id = 'chonkers';

module.exports = Chonkers;
