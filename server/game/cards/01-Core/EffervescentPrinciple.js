const Card = require('../../Card.js');

class EffervescentPrinciple extends Card {
    // Play: Each player loses half their <A> (rounding down the loss). Gain 1 chain.
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain a chain and make both players lose half their amber',
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: context.player.opponent
                        ? Math.floor(context.player.opponent.amber / 2)
                        : 0
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

module.exports = EffervescentPrinciple;
