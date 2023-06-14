const Card = require('../../Card.js');

class ImperialForge extends Card {
    // Play: Forge a key at +8 current cost, reduced by 1 for each  on friendly creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier:
                    8 -
                    context.player.creaturesInPlay.reduce((total, card) => total + card.amber, 0)
            }))
        });
    }
}

ImperialForge.id = 'imperial-forge';

module.exports = ImperialForge;
