const Card = require('../../Card.js');

class RegrettableMeteor extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.power > 5 || card.hasTrait('dinosaur')
                )
            }))
        });
    }
}

RegrettableMeteor.id = 'regrettable-meteor';

module.exports = RegrettableMeteor;
