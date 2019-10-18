const Card = require('../../Card.js');

class Proclamation346E extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.opponent && this.game.getHousesInPlay({ cards: this.controller.opponent.creaturesInPlay }).length < 3,
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Proclamation346E.id = 'proclamation-346e';

module.exports = Proclamation346E;
