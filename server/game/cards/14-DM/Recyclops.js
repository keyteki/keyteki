const Card = require('../../Card.js');

class Recyclops extends Card {
    // After Reap: Discard a card. If you do, give a creature two +1
    // power counters.
    setupCardAbilities(ability) {
        this.reap({
            preferActionPromptMessage: true,
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter({ amount: 2 })
                },
                message: '{0} uses {1} to give two +1 power counters to {2}'
            }
        });
    }
}

Recyclops.id = 'recyclops';

module.exports = Recyclops;
