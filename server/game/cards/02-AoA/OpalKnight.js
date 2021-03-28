const Card = require('../../Card.js');

class OpalKnight extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power % 2 === 0)
            }))
        });
    }
}

OpalKnight.id = 'opal-knight';

module.exports = OpalKnight;
