const Card = require('../../Card.js');

class UmbraBot extends Card {
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

UmbraBot.id = 'umbra-bot';

module.exports = UmbraBot;
