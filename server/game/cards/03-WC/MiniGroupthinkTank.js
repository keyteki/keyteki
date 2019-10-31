const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class MiniGroupthinkTank extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'deal 8 damage to {0}',
            target: {
                cardType: 'creature',
                cardCondition: card => card.neighbors.filter(neighbor => Constants.Houses.some(house => card.hasHouse(house) && neighbor.hasHouse(house))).length > 1,
                gameAction: ability.actions.dealDamage({ amount: 8 })
            }
        });
    }
}

MiniGroupthinkTank.id = 'mini-groupthink-tank';

module.exports = MiniGroupthinkTank;
