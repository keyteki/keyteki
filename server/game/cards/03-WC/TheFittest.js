const Card = require('../../Card.js');

class TheFittest extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.player.creaturesInPlay,
                amount: 1
            }))
        });
    }
}

TheFittest.id = 'the-fittest';

module.exports = TheFittest;
