const Card = require('../../Card.js');

class Crunch extends Card {
    // After Fight/After Reap: Give Crunch a number of +1 power
    // counters equal to a neighboring creature's power.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.source,
                    amount: context.target.power
                }))
            }
        });
    }
}

Crunch.id = 'crunch';

module.exports = Crunch;
