const Card = require('../../Card.js');

class Stomp extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            },
            then: {
                condition: context => context.preThenEvent.destroyed,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                }
            }
        });
    }
}

Stomp.id = 'stomp';

module.exports = Stomp;
