const Card = require('../../Card.js');

class ZzyszzSCompactor extends Card {
    // Action: Put a creature on the bottom of its owner's deck. If you do, give a creature two +1 power counters.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToDeck({ bottom: true })
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

ZzyszzSCompactor.id = 'zzyszz-s-compactor';

module.exports = ZzyszzSCompactor;
