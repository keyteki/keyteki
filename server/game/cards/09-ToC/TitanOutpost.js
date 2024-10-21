const Card = require('../../Card.js');

class TitanOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner's
    // deck. If you do, make a token creature and archive a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature',
                then: {
                    alwaysTriggers: true,
                    target: {
                        location: 'hand',
                        controller: 'self',
                        gameAction: ability.actions.archive()
                    },
                    message: '{0} uses {1} to archive a card'
                }
            }
        });
    }
}

TitanOutpost.id = 'titan-outpost';

module.exports = TitanOutpost;
