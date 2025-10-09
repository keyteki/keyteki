const Card = require('../../Card.js');

class StealthMode extends Card {
    // Play: Your opponent cannot play action cards during their next turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from playing any actions on their next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.playerCannot(
                    'play',
                    (context) => context.source.type === 'action'
                )
            })
        });
    }
}

StealthMode.id = 'stealth-mode';

module.exports = StealthMode;
