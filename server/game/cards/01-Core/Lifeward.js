const Card = require('../../Card.js');

class Lifeward extends Card {
    setupCardAbilities(ability) {
        this.omni({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} unable to play creatures on their next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.lastingEffect({
                    targetController: 'opponent',
                    effect: ability.effects.playerCannot(
                        'play',
                        (context) => context.source.type === 'creature'
                    )
                })
            ]
        });
    }
}

Lifeward.id = 'lifeward';

module.exports = Lifeward;
