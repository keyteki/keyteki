const Card = require('../../Card.js');

class ExeldonYash extends Card {
    // After Reap: Capture 2A. You may discard a card. If you do, move 1A from Exeldon Yash to your pool.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                target: {
                    optional: true,
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                then: (preThenContext) => ({
                    condition: () =>
                        !!preThenContext.target &&
                        preThenContext.preThenEvents.some(
                            (event) => event.name === 'onCapture' && event.amount === 2
                        ),
                    gameAction: ability.actions.returnAmber({
                        target: preThenContext.source,
                        amount: 1,
                        recipient: preThenContext.player
                    })
                })
            }
        });
    }
}

ExeldonYash.id = 'exeldon-yash';

module.exports = ExeldonYash;
