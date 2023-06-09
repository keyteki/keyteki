const Card = require('../../Card.js');

class Earthshaker extends Card {
    // Play: Destroy each creature with power 3 or lower.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power <= 3)
            }))
        });
    }
}

Earthshaker.id = 'earthshaker';

module.exports = Earthshaker;
