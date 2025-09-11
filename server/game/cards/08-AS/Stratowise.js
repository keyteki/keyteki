const Card = require('../../Card.js');

class Stratowise extends Card {
    // After Fight/After Reap: Discard a card. If you are haunted, capture 1A.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isHaunted() && context.player.opponent,
                gameAction: ability.actions.capture(),
                message: '{0} uses {1} to capture 1 amber from {3}',
                messageArgs: (context) => [context.player.opponent]
            }
        });
    }
}

Stratowise.id = 'stratowise';

module.exports = Stratowise;
