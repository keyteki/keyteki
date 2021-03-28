const Card = require('../../Card.js');

class Pride extends Card {
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
