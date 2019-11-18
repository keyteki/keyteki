const Card = require('../../Card.js');

class Quadracorder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() => this.game.getHousesInPlay(this.controller.creaturesInPlay).length)
        });
    }
}

Quadracorder.id = 'quadracorder';

module.exports = Quadracorder;
