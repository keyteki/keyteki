const Card = require('../../Card.js');

class SacrificialAltar extends Card {
    // Action: Purge a friendly Human creature from play. If you do, play a creature from your discard pile.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasTrait('human'),
                gameAction: ability.actions.purge()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    location: 'discard',
                    gameAction: ability.actions.playCard()
                },
                message: "{0} plays {1} from their discard pile due to {1}'s effect"
            }
        });
    }
}

SacrificialAltar.id = 'sacrificial-altar';

module.exports = SacrificialAltar;
