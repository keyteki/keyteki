const Card = require('../../Card.js');

class InstantTransmission extends Card {
    // Omni: Draw 3 cards. Destroy Instant Transmission.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [ability.actions.draw({ amount: 3 }), ability.actions.destroy()],
            message: '{0} uses {1} to draw 3 cards and destroy it',
            messageArgs: (context) => [context.player, context.source]
        });
    }
}

InstantTransmission.id = 'instant-transmission';

module.exports = InstantTransmission;
