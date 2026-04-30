const Card = require('../../Card.js');

class ExeldonYash extends Card {
    // After Reap: Capture 2A. You may discard a card. If you do, move 1A from
    // Exeldon Yash to your pool.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                target: {
                    optional: true,
                    activePromptTitle: 'You may discard a card to move 1 amber to your pool',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                then: (preThenContext) => ({
                    condition: () =>
                        !!preThenContext.target && preThenContext.source.hasToken('amber'),
                    gameAction: ability.actions.returnAmber((context) => ({
                        target: context.source,
                        amount: 1,
                        recipient: context.player
                    }))
                })
            }
        });
    }
}

ExeldonYash.id = 'exeldon-yash';

module.exports = ExeldonYash;
