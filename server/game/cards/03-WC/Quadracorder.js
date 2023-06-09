const Card = require('../../Card.js');

class Quadracorder extends Card {
    // Your opponents keys cost +1A for each house represented among friendly creatures (to a maximum of3).
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
