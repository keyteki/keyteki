const Card = require('../../Card.js');

class LesserOxtet extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.purge((context) => ({
                target: context.player.hand
            }))
        });

        this.reap({
            effect: "increase key cost by 3 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LesserOxtet.id = 'lesser-oxtet';

module.exports = LesserOxtet;
