const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class Quadracorder extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(() => Constants.Houses.filter(house => this.controller.creaturesInPlay.some(card => card.hasHouse(house))).length)
            })
        });
    }
}

Quadracorder.id = 'quadracorder';

module.exports = Quadracorder;
