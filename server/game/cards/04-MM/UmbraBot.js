const Card = require('../../Card.js');

class UmbraBot extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
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

UmbraBot.id = 'umbra-bot';

module.exports = UmbraBot;
