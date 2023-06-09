const Card = require('../../Card.js');

class DarkQueenGloriana extends Card {
    // Enhance AA. (These icons have already been added to cards in your deck.)
    // Play: Return a friendly non-Untamed creature to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => !card.hasHouse('untamed'),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

DarkQueenGloriana.id = 'dark-queen-gloriana';

module.exports = DarkQueenGloriana;
