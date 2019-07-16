const Card = require('../../Card.js');

class Gongoozle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: context => ({
                condition: () => context.target.location === 'play area',
                gameAction: ability.actions.discardAtRandom({ target: context.target.controller })
            })
        });
    }
}

Gongoozle.id = 'gongoozle';

module.exports = Gongoozle;
