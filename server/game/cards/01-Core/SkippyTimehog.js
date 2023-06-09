const Card = require('../../Card.js');

class SkippyTimehog extends Card {
    // Play: Your opponent cannot use any cards next turn. (Cards can still be played and discarded.)
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from using any cards next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.playerCannot('use')
            })
        });
    }
}

SkippyTimehog.id = 'skippy-timehog';

module.exports = SkippyTimehog;
