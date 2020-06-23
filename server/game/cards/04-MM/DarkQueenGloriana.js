const Card = require('../../Card.js');

class DarkQueenGloriana extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('untamed'),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

DarkQueenGloriana.id = 'dark-queen-gloriana';

module.exports = DarkQueenGloriana;
