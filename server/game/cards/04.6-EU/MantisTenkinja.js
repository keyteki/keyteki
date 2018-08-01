const DrawCard = require('../../drawcard.js');

class MantisTenkinja extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onResolveFateCost: (event, context) => event.card.type === 'event' && event.player === context.player
            },
            cost: ability.costs.payHonor(1),
            effect: 'reduce the cost of their next event by 1',
            gameAction: ability.actions.playerLastingEffect(context => ({
                effect: ability.effects.reduceNextPlayedCardCost(1, card => card === context.event.card)
            }))
        });
    }
}

MantisTenkinja.id = 'mantis-tenkinja';

module.exports = MantisTenkinja;
