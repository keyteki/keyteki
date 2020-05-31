const Card = require('../../Card.js');

class LesserOxtet extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.purge((context) => ({
                target: context.player.hand
            }))
        });

        this.reap({
            effect: "increase {1}'s key cost by 3 until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LesserOxtet.id = 'lesser-oxtet';

module.exports = LesserOxtet;
