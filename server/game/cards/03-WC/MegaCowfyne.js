const Card = require('../../Card.js');

class MegaCowfyne extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'deal 2 damage to each neighbor of the creature being fought',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 2,
                target: context.event.card.neighbors
            }))
        });
    }
}

MegaCowfyne.id = 'mega-cowfyne';

module.exports = MegaCowfyne;
