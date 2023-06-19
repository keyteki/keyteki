const Card = require('../../Card.js');

class Sandhopper extends Card {
    // Action: Return a friendly creature to its owners hand. If you do, you may play a nonEkwidon creature from your hand.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToHand()
            },
            then: {
                target: {
                    cardType: 'creature',
                    location: 'hand',
                    cardCondition: (card) => !card.hasHouse('ekwidon'),
                    gameAction: ability.actions.playCard()
                }
            }
        });
    }
}

Sandhopper.id = 'sandhopper';

module.exports = Sandhopper;
