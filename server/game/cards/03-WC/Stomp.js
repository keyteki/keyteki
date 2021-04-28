const Card = require('../../Card.js');

class Stomp extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            },
            then: (context) => ({
                condition: () => context.target.location !== 'play area',
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                }
            })
        });
    }
}

Stomp.id = 'stomp';

module.exports = Stomp;
