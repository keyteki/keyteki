const Card = require('../../Card.js');

class EffervescentPrinciple extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain a chain and make both players lose half their amber',
            gameAction: [
                ability.actions.loseAmber(context => ({
                    amount: Math.floor((context.player.opponent.amber + 1) / 2)
                })),
                ability.actions.loseAmber(context => ({
                    target: context.player,
                    amount: Math.floor((context.player.amber + 1) / 2)
                })),
                ability.actions.gainChains()
            ]
        });
    }
}

EffervescentPrinciple.id = 'effervescent-principle'; // This is a guess at what the id might be - please check it!!!

module.exports = EffervescentPrinciple;
