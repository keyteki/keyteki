const Card = require('../../Card.js');

class BrokenAxeOutpost extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 6 })
                },
                message: '{0} uses {1} and puts {2} on the bottom of their to deal 6 damage to {3}'
            }
        });
    }
}

BrokenAxeOutpost.id = 'broken-axe-outpost';

module.exports = BrokenAxeOutpost;
