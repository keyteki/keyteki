const Card = require('../../Card.js');

class TheSpiritsWay extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power >= 3)
            }))
        });
    }
}

TheSpiritsWay.id = 'the-spirit-s-way';

module.exports = TheSpiritsWay;
