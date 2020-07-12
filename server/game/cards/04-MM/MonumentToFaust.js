const Card = require('../../Card.js');

class MonumentToFaust extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: "increase {1}'s key cost by {2} until the end of their next turn",
            effectArgs: (context) => [
                context.player.opponent,
                context.player.discard.some((card) => card.name === 'Faust the Great') ? 2 : 1
            ],
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost((player, context) =>
                    context.player.discard.some((card) => card.name === 'Faust the Great') ? 2 : 1
                )
            })
        });
    }
}

MonumentToFaust.id = 'monument-to-faust';

module.exports = MonumentToFaust;
