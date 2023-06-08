const Card = require('../../Card.js');

class Pride extends Card {
    // Reap: Ward each friendly Sin creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.ward((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.hasTrait('sin'))
            })),
            effect: 'ward each friendly sin creatures'
        });
    }
}

Pride.id = 'pride';

module.exports = Pride;
