const Card = require('../../Card.js');

class SirMarrows extends Card {
    // After your opponent gains A by reaping, Sir Marrows captures it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onModifyAmber: (event, context) =>
                    event.reap && event.player !== context.source.controller
            },
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.event.amount
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    amount:
                        context.source.controller.opponent &&
                        context.source.controller.opponent.anyEffect('captureFromPool')
                            ? 1
                            : 0,
                    cancel: false
                }))
            ]),
            effect: 'capture 1 amber'
        });
    }
}

SirMarrows.id = 'sir-marrows';

module.exports = SirMarrows;
