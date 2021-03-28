const Card = require('../../Card.js');

class OppositionResearch extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

OppositionResearch.id = 'opposition-research';

module.exports = OppositionResearch;
