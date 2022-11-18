const Card = require('../../Card.js');

class Kaboom extends Card {
    //Play: Put each Mars creature into its owner's archives. Destroy each creature. Gain 3 chains.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.archive((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                })),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.gainChains({ amount: 3 })
            ])
        });
    }
}

Kaboom.id = 'kaboom';

module.exports = Kaboom;
