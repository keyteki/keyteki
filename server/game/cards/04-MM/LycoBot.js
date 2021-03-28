const Card = require('../../Card.js');

class LycoBot extends Card {
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
