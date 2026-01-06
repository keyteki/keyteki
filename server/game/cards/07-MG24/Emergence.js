const Card = require('../../Card.js');

class Emergence extends Card {
    // Play: Search your deck and discard pile for a friendly Keyraken creature and play it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: ['deck', 'discard'],
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('keyraken'),
                gameAction: ability.actions.playCard()
            },
            then: {
                gameAction: ability.actions.shuffleDeck()
            }
        });
    }
}

Emergence.id = 'emergence';

module.exports = Emergence;
