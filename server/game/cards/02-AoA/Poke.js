const Card = require('../../Card.js');

class Poke extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent && context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.draw()
            }
        });
    }
}

Poke.id = 'poke';

module.exports = Poke;
