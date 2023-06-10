const Card = require('../../Card.js');

class Faygin extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Return an Urchin from play or from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                location: ['play area', 'discard'],
                controller: 'self',
                cardCondition: (card) => card.name === 'Urchin',
                gameAction: ability.actions.returnToHand((context) => ({
                    location: context.target.location
                }))
            }
        });
    }
}

Faygin.id = 'faygin';

module.exports = Faygin;
