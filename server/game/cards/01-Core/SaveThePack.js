const Card = require('../../Card.js');

class SaveThePack extends Card {
    // Play: Destroy each damaged creature. Gain 1chain.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each damaged creature and gain 1 chain',
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
                })),
                ability.actions.gainChains()
            ]
        });
    }
}

SaveThePack.id = 'save-the-pack';

module.exports = SaveThePack;
