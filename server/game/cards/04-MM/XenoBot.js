const Card = require('../../Card.js');

class XenoBot extends Card {
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

        // TODO Add fight action copy of umbra alien
    }
}

XenoBot.id = 'xeno-bot';

module.exports = XenoBot;
