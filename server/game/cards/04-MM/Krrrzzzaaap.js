const Card = require('../../Card.js');

class Krrrzzzaaap extends Card {
    // Play: Destroy each non-Mutant creature. Gain 1 chain.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each non-Mutant creature',
            gameAction: [
                ability.actions.gainChains({ amount: 1 }),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('mutant'))
                }))
            ]
        });
    }
}

Krrrzzzaaap.id = 'krrrzzzaaap';

module.exports = Krrrzzzaaap;
