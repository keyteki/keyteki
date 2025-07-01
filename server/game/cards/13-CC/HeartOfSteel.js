const Card = require('../../Card.js');

class HeartOfSteel extends Card {
    // Play: Play a Skyborn creature from your discard pile.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('skyborn'),
                gameAction: ability.actions.playCard()
            }
        });
    }
}

HeartOfSteel.id = 'heart-of-steel';

module.exports = HeartOfSteel;
