const Card = require('../../Card.js');

class LookOverThere extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvent &&
                    (!context.preThenEvent.destroyEvent ||
                        context.preThenEvent.destroyEvent.cancelled),
                gameAction: ability.actions.steal(),
                message: '{0} uses {1} to steal 1 amber'
            }
        });
    }
}

LookOverThere.id = 'look-over-there';

module.exports = LookOverThere;
