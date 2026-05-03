const Card = require('../../Card.js');

class AuthorizedRequisitions extends Card {
    // Play: A friendly creature captures 2A. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture({ amount: 2 })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw(),
                message: '{0} uses {1} to draw a card'
            }
        });
    }
}

AuthorizedRequisitions.id = 'authorized-requisitions';

module.exports = AuthorizedRequisitions;
