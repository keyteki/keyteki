const Card = require('../../Card.js');

class WarriorsRefrain extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power <= 3)
            }))
        });
    }
}

WarriorsRefrain.id = 'warriors--refrain';

module.exports = WarriorsRefrain;
