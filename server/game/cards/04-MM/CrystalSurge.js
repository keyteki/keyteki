const Card = require('../../Card.js');

class CrystalSurge extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasTrait('mutant'))
            }))
        });
    }
}

CrystalSurge.id = 'crystal-surge';

module.exports = CrystalSurge;
