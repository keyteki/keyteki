const Card = require('../../Card.js');

class RegrettableMeteor extends Card {
    // Play: Destroy each Dinosaur creature and each creature with power 6 or higher.
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
