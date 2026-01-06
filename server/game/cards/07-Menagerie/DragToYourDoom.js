const Card = require('../../Card.js');

class DragToYourDoom extends Card {
    // Play: Put an enemy flank creature on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.returnToDeck({ bottom: true })
            }
        });
    }
}

DragToYourDoom.id = 'drag-to-your-doom';

module.exports = DragToYourDoom;
