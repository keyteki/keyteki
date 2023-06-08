const Card = require('../../Card.js');

class Whisper extends Card {
    // Elusive.
    // Action: Lose 1. If you do, destroy a creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                message: '{0} uses {1} to destroy {2}',
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Whisper.id = 'whisper';

module.exports = Whisper;
