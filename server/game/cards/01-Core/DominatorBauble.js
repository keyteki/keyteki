const Card = require('../../Card.js');

class DominatorBauble extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.use()
            }
        });
    }
}

DominatorBauble.id = 'dominator-bauble';

module.exports = DominatorBauble;
