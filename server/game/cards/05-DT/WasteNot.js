const Card = require('../../Card.js');

class WasteNot extends Card {
    // Play: Destroy a friendly creature. Draw cards equal to half that creature's power (rounding up).
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            effect: 'destroy {0}',
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to draw {3} cards',
                messageArgs: (context) =>
                    Math.ceil(context.preThenEvents[0].clone.modifiedPower * 0.5),
                gameAction: ability.actions.draw((context) => ({
                    target: context.player,
                    amount: Math.ceil(context.preThenEvents[0].clone.modifiedPower * 0.5)
                }))
            }
        });
    }
}

WasteNot.id = 'waste-not';

module.exports = WasteNot;
