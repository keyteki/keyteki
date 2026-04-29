const Card = require('../../Card.js');

class Recyclops extends Card {
    // After Reap: Discard a card. If you do, give a creature two +1
    // power counters.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter({ amount: 2 })
                }
            }
        });
    }
}

Recyclops.id = 'recyclops';

module.exports = Recyclops;
