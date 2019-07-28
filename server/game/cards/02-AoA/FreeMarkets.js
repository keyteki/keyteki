const Card = require('../../Card.js');

class FreeMarkets extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 amber for each house represented amongst cards in play (except Sanctum)',
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount:
                ((context.player.cardsInPlay.filter(card => card.hasHouse('brobnar')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('brobnar')).length) > 0 ? 1 : 0) +
                ((context.player.cardsInPlay.filter(card => card.hasHouse('dis')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('dis')).length) > 0 ? 1 : 0) +
                ((context.player.cardsInPlay.filter(card => card.hasHouse('logos')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('logos')).length) > 0 ? 1 : 0) +
                ((context.player.cardsInPlay.filter(card => card.hasHouse('mars')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('mars')).length) > 0 ? 1 : 0) +
                ((context.player.cardsInPlay.filter(card => card.hasHouse('shadows')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('shadows')).length) > 0 ? 1 : 0) +
                ((context.player.cardsInPlay.filter(card => card.hasHouse('untamed')).length || context.player.opponent.cardsInPlay.filter(card => card.hasHouse('untamed')).length) > 0 ? 1 : 0)
            }))
        });
    }
}

FreeMarkets.id = 'free-markets';

module.exports = FreeMarkets;
