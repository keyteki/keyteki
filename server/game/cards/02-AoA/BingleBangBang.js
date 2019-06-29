const Card = require('../../Card.js');

class BingleBangBang extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'deal 5 damage to each neighbour of the creature being fought',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 5,
                target: context.event.card.neighbors
            }))
        });
    }
}

BingleBangBang.id = 'bingle-bangbang';

module.exports = BingleBangBang;
