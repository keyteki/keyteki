const Card = require('../../Card.js');

class Chonkers extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
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
