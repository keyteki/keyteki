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
                message: '{0} uses {1} to deal 6 damage to {2}'
            }
        });
    }
}

BrokenAxeOutpost.id = 'broken-axe-outpost';

module.exports = BrokenAxeOutpost;
