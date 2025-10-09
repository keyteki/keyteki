const Card = require('../../Card.js');

class OppositionResearch extends Card {
    // Enhance D. (These icons have already been added to cards in your deck.)
    // Play:  Enemy creatures cannot reap during your opponents next turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

OppositionResearch.id = 'opposition-research';

module.exports = OppositionResearch;
