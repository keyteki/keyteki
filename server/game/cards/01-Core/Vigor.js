const Card = require('../../Card.js');

class Vigor extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 3 })
            },
            then: {
                condition: context => context.preThenEvent.amount === 3,
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Vigor.id = 'vigor'; // This is a guess at what the id might be - please check it!!!

module.exports = Vigor;
