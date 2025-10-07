import Card from '../../Card.js';

class EffervescentPrinciple extends Card {
    // Play: Each player loses half their <A> (rounding down the loss). Gain 1 chain.
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 chain and make {1} lose {2} amber and {3} lose {4} amber',
            effectArgs: (context) => [
                context.player,
                Math.floor(context.player.amber / 2),
                context.player.opponent,
                Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2)
            ],
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: Math.floor(
                        (context.player.opponent ? context.player.opponent.amber : 0) / 2
                    )
                })),
                ability.actions.loseAmber((context) => ({
                    target: context.player,
                    amount: Math.floor(context.player.amber / 2)
                })),
                ability.actions.gainChains()
            ]
        });
    }
}

EffervescentPrinciple.id = 'effervescent-principle';

export default EffervescentPrinciple;
