const Card = require('../../Card.js');

class FreeMarkets extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount: Math.min(6, context.game.getHousesInPlay({ filter: house => house !== 'sanctum' }).length)
            }))
        });
    }
}

FreeMarkets.id = 'free-markets';

module.exports = FreeMarkets;
