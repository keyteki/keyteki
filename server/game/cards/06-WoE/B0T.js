const TokenCard = require('../../TokenCard.js');

class B0T extends TokenCard {
    //Action: Use a friendly non-Star Alliance creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            }
        });
    }
}

B0T.id = 'b0-t';

module.exports = B0T;
