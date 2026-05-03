const Card = require('../../Card.js');

class AuthorizedRequisitions extends Card {
    // Play: A friendly creature captures 2A. Draw a card.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            gameAction: [
                ability.actions.capture({
                    amount: 2,
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self'
                    }
                }),
                ability.actions.draw({ effectMsg: null })
            ]
        });
    }
}

AuthorizedRequisitions.id = 'authorized-requisitions';

module.exports = AuthorizedRequisitions;
