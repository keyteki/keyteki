const Card = require('../../Card.js');

class SubmersivePrinciple extends Card {
    // (T) Play: Each player loses 1A. If the tide is high, each player loses half their A instead (rounding down the loss).
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: context.player.isTideHigh() ? Math.floor(context.player.amber / 2) : 1,
                    target: context.player
                })),
                ability.actions.loseAmber((context) => ({
                    amount:
                        context.player.opponent && context.player.isTideHigh()
                            ? Math.floor(context.player.opponent.amber / 2)
                            : 1
                }))
            ],
            effect: 'make each player lose {0}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'half of their amber' : '1 amber'
        });
    }
}

SubmersivePrinciple.id = 'submersive-principle';

module.exports = SubmersivePrinciple;
