const Card = require('../../Card.js');

class HeistNight extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.creaturesInPlay.filter((card) => card.hasTrait('thief'))
                    .length
            }))
        });
    }
}

HeistNight.id = 'heist-night';

module.exports = HeistNight;
