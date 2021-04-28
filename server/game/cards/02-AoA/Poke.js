const Card = require('../../Card.js');

class Poke extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: (context) => ({
                condition: () => context.target.location !== 'play area',
                message: '{0} uses {1} to draw a card',
                gameAction: ability.actions.draw()
            })
        });
    }
}

Poke.id = 'poke';

module.exports = Poke;
