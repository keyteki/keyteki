const Card = require('../../Card.js');

class Lifeward extends Card {
    // Omni: Sacrifice Lifeward. Your opponent cannot play creatures
    // on their next turn.
    setupCardAbilities(ability) {
        this.omni({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} unable to play creatures on their next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    effect: ability.effects.playerCannot(
                        'play',
                        (context) => context.ability.title === 'Play this creature'
                    )
                })
            ]
        });
    }
}

Lifeward.id = 'lifeward';

module.exports = Lifeward;
