const Card = require('../../Card.js');

class Bubbles extends Card {
    // Play: Put an enemy creature on top of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

Bubbles.id = 'bubbles';

module.exports = Bubbles;
