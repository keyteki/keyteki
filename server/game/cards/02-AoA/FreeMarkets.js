const Card = require('../../Card.js');

class FreeMarkets extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount: ['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed'].filter(house =>
                    context.game.cardsInPlay.some(card => card.hasHouse(house))
                ).length
            }))
        });
    }
}

FreeMarkets.id = 'free-markets';

module.exports = FreeMarkets;
