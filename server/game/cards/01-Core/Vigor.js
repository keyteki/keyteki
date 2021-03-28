const Card = require('../../Card.js');

class Vigor extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 3, upTo: true })
            },
            then: {
                condition: (context) => context.preThenEvent.amount === 3,
                message: '{0} gains an additional amber due to {1} healing 3 damage',
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Vigor.id = 'vigor';

module.exports = Vigor;
