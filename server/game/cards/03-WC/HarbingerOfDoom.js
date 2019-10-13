const Card = require('../../Card.js');

class HarbingerOfDoom extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            optional: false,
            gameAction: ability.actions.destroy(context => ({ target: context.game.creaturesInPlay.filter(card => card !== this) }))
        });
    }
}

HarbingerOfDoom.id = 'harbinger-of-doom';

module.exports = HarbingerOfDoom;
