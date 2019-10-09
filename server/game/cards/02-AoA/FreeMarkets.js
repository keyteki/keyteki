const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class FreeMarkets extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount: Math.min(Constants.HOUSES.filter(house =>
                    house !== 'sanctum' && context.game.cardsInPlay.some(card => card.hasHouse(house))).length, 6)
            }))
        });
    }
}

FreeMarkets.id = 'free-markets';

module.exports = FreeMarkets;
