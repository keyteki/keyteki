const Card = require('../../Card.js');

class HedonisticIntent extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt(context => ({
                target: context.game.creaturesInPlay.filter(card => card.isOnFlank())
            }))
        });
    }
}

HedonisticIntent.id = 'hedonistic-intent';

module.exports = HedonisticIntent;
