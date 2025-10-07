import Card from '../../Card.js';

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
            effect: 'make {1} lose {2} amber and {3} lose {4} amber',
            effectArgs: (context) => [
                context.player,
                context.player.isTideHigh()
                    ? Math.floor(context.player.amber / 2)
                    : Math.min(1, context.player.amber),
                context.player.opponent,
                context.player.isTideHigh()
                    ? Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2)
                    : Math.min(1, context.player.opponent ? context.player.opponent.amber : 0)
            ]
        });
    }
}

SubmersivePrinciple.id = 'submersive-principle';

export default SubmersivePrinciple;
