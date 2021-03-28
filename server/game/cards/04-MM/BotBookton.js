const Card = require('../../Card.js');

class BotBookton extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                target: context.player.deck[0]
            }))
        });
    }
}

BotBookton.id = 'bot-bookton';

module.exports = BotBookton;
