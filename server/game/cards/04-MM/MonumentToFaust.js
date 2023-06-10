const Card = require('../../Card.js');

class MonumentToFaust extends Card {
    // Action: Keys cost +1A during your opponents next turn. If Faust the Great is in your discard pile, keys cost +2A during your opponents next turn instead.
    setupCardAbilities(ability) {
        this.action({
            effect: "increase key cost by {2} during {1}'s next turn",
            effectArgs: (context) => [
                context.player.opponent,
                context.player.discard.some((card) => card.name === 'Faust the Great') ? 2 : 1
            ],
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost((player, context) =>
                    context.player.discard.some((card) => card.name === 'Faust the Great') ? 2 : 1
                )
            })
        });
    }
}

MonumentToFaust.id = 'monument-to-faust';

module.exports = MonumentToFaust;
