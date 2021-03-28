const Card = require('../../Card.js');

class Curiosity extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy all Scientist creatures',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasTrait('scientist'))
            }))
        });
    }
}

Curiosity.id = 'curiosity';

module.exports = Curiosity;
