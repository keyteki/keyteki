const Card = require('../../Card.js');

class Chenille extends Card {
    //Hazardous 6.
    //Action: Return a Cocoon from your discard pile to your hand.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                cardCondition: (card) => card.name === 'Bombyx',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Chenille.id = 'chenille';

module.exports = Chenille;
