const Card = require('../../Card.js');

class PyrotechnicFlash extends Card {
    // Play: Deal 2 damage to a creature, with 1 splash. If this damage destroys 2 or more creatures, steal 1.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2,
                    splash: 1
                })
            },
            then: {
                condition: (context) =>
                    context.preThenEvents.filter(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ).length >= 2,
                gameAction: ability.actions.steal({ amount: 1 }),
                message: '{0} uses {1} to steal 1 amber'
            }
        });
    }
}

PyrotechnicFlash.id = 'pyrotechnic-flash';

module.exports = PyrotechnicFlash;
