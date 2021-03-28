const Card = require('../../Card.js');

class Quadracorder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() =>
                Math.min(this.game.getHousesInPlay(this.controller.creaturesInPlay).length, 3)
            )
        });
    }
}

Quadracorder.id = 'quadracorder';

module.exports = Quadracorder;
