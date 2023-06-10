const Card = require('../../Card.js');

class Greed extends Card {
    // During your draw cards step, refill your hand to 1 additional card for each friendly Sin creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(
                (player) => player.creaturesInPlay.filter((card) => card.hasTrait('sin')).length
            )
        });
    }
}

Greed.id = 'greed';

module.exports = Greed;
