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

DominatorBauble.id = 'dominator-bauble'; // This is a guess at what the id might be - please check it!!!

module.exports = DominatorBauble;
