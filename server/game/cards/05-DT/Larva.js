const Card = require('../../Card.js');

class Larva extends Card {
    //Hazardous 6.
    //Action: Return a Cocoon from your discard pile to your hand.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: hazardous 6
        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                cardCondition: (card) => card.name === 'Cocoon?', // TODO: replace with final name for Cocoon
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Larva.id = 'larva';

module.exports = Larva;
