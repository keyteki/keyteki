const Card = require('../../Card.js');

class JVinda extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                condition: context => context.preThenEvent.destroyed,
                gameAction: ability.actions.steal()
            }
        });
    }
}

JVinda.id = 'j-vinda';

module.exports = JVinda;
