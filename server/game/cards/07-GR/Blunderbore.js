const Card = require('../../Card.js');

class Blunderbore extends Card {
    // After Fight: If you are haunted, your opponent loses 2 A. Otherwise,
    // your opponent loses 1 A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.source.controller.opponent,
                amount: context.source.controller.isHaunted() ? 2 : 1
            }))
        });
    }
}

Blunderbore.id = 'blunderbore';

module.exports = Blunderbore;
