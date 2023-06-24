const Card = require('../../Card.js');

class SacroBot extends Card {
    // Reap: Discard a card from your hand. If you do, draw a card.
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
    }
}

SacroBot.id = 'sacro-bot';

module.exports = SacroBot;
