const Card = require('../../Card.js');

class DarkQueenGloriana extends Card {
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
