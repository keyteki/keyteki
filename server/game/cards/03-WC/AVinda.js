const Card = require('../../Card.js');

class AVinda extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent && context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.discardAtRandom()
            }
        });
    }
}

AVinda.id = 'a-vinda';

module.exports = AVinda;
