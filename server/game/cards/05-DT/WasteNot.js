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
                messageArgs: (context) => {
                    const power =
                        context.preThenEvents.length > 0 && context.preThenEvents[0].clone
                            ? context.preThenEvents[0].clone.modifiedPower
                            : 0;
                    return Math.ceil(power * 0.5);
                },
                gameAction: ability.actions.draw((context) => {
                    const power =
                        context.preThenEvents.length > 0 && context.preThenEvents[0].clone
                            ? context.preThenEvents[0].clone.modifiedPower
                            : 0;
                    return {
                        target: context.player,
                        amount: Math.ceil(power * 0.5)
                    };
                })
            }
        });
    }
}

WasteNot.id = 'waste-not';

module.exports = WasteNot;
