const Card = require('../../Card.js');

class MiasmaBomb extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            effect: 'destroy {0} and make {1} skip their key step next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.sequential([
                ability.actions.sacrifice(),
                ability.actions.lastingEffect({
                    targetController: 'opponent',
                    effect: ability.effects.skipStep('key')
                })
            ])
        });
    }
}

MiasmaBomb.id = 'miasma-bomb';

module.exports = MiasmaBomb;
