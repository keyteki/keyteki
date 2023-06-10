const Card = require('../../Card.js');

class DaemoBot extends Card {
    // Reap: Discard a card from your hand. If you do, draw a card.
    // Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });

        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DaemoBot.id = 'dæmo-bot';

module.exports = DaemoBot;
