const Card = require('../../Card.js');

class PowerOfFire extends Card {
    // Play: Sacrifice a friendly creature. If you do, each player loses A equal to half that creatures power (rounding down the loss). Gain 1 chain.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to sacrifice',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sacrifice()
            },
            gameAction: ability.actions.gainChains(),
            effect: 'sacrifice {0} and gain 1 chain',
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.every((event) => !event.cancelled),
                message: '{0} uses {1} to cause each player to lose {3} amber',
                messageArgs: (context) => [
                    Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                ],
                gameAction: [
                    ability.actions.loseAmber((context) => ({
                        amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                    })),
                    ability.actions.loseAmber((context) => ({
                        target: context.player,
                        amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                    }))
                ]
            }
        });
    }
}

PowerOfFire.id = 'power-of-fire';

module.exports = PowerOfFire;
