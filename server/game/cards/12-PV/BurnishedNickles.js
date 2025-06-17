const Card = require('../../Card.js');

class BurnishedNickles extends Card {
    // Elusive. Enhance .
    // Destroyed: Return another creature to its owner's hand.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

BurnishedNickles.id = 'burnished-nickles';

module.exports = BurnishedNickles;
