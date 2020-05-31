const Card = require('../../Card.js');

class BingleBangBang extends Card {
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'deal 5 damage to each neighbor of the creature being fought',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 5,
                target: context.event.card.neighbors
            }))
        });
    }
}

BingleBangBang.id = 'bingle-bangbang';

module.exports = BingleBangBang;
