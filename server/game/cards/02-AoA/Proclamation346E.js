const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class Proclamation346E extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.opponent &&
                this.controller.opponent.creaturesInPlay.filter(card => Constants.Houses.some(house => card.hasHouse(house))).length < 3,
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Proclamation346E.id = 'proclamation-346e';

module.exports = Proclamation346E;
