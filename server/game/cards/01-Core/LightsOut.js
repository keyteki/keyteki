const Card = require('../../Card.js');

class LightsOut extends Card {
    // Play: Return 2enemy creatures to their owners hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

LightsOut.id = 'lights-out';

module.exports = LightsOut;
