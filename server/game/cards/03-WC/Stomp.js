const Card = require('../../Card.js');

class Stomp extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                message: '{0} uses {1} to exalt {2}'
            }
        });
    }
}

Stomp.id = 'stomp';

module.exports = Stomp;
