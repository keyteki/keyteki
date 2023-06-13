const Card = require('../../Card.js');

class FreeMarkets extends Card {
    // Play: Gain 1A (to a maximum of 6) for each house represented among cards in play, except for Sanctum.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: Math.min(
                    6,
                    context.game
                        .getHousesInPlay(context.game.cardsInPlay, true)
                        .filter((house) => house !== 'sanctum').length
                )
            }))
        });
    }
}

FreeMarkets.id = 'free-markets';

module.exports = FreeMarkets;
