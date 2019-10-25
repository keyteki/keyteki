const Card = require('../../Card.js');

class HarvestTime extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'trait'
            },
            gameAction: [
                ability.actions.purge(context => ({
                    target: context.game.cardsInPlay.filter(card => card.hasTrait(context.trait))
                })),
                ability.actions.gainAmber(context => ({
                    amount: context.player.cardsInPlay.filter(card => card.hasTrait(context.trait)).length
                })),
                ability.actions.gainAmber(context => ({
                    target: context.player.opponent,
                    amount: context.player.opponent ? context.player.opponent.cardsInPlay.filter(card => card.hasTrait(context.trait)).length : 0
                }))
            ]
        });
    }
}

HarvestTime.id = 'harvest-time';

module.exports = HarvestTime;
