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
                gameAction: ability.actions.chosenDiscard({ target: context.target.controller })
            })
        });
    }
}

Gongoozle.id = 'gongoozle'; // This is a guess at what the id might be - please check it!!!

module.exports = Gongoozle;
