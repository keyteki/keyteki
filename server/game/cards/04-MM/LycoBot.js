const Card = require('../../Card.js');

class LycoBot extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
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

LycoBot.id = 'lyco-bot';

module.exports = LycoBot;
