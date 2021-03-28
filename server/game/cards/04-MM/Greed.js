const Card = require('../../Card.js');

class Greed extends Card {
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
