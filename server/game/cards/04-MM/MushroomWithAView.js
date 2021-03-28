const Card = require('../../Card.js');

class MushroomWithAView extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.heal((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay
            }))
        });
    }
}

MushroomWithAView.id = 'mushroom-with-a-view';

module.exports = MushroomWithAView;
