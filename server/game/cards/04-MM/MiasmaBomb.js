const Card = require('../../Card.js');

class MiasmaBomb extends Card {
    // Enhance . (These icons have already been added to cards in your deck.)
    // Action: Destroy Miasma Bomb. Your opponent skips the "forge a key" step during their next turn.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            effect: 'destroy {0} and make {1} skip their key step next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.sequential([
                ability.actions.sacrifice(),
                ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    effect: ability.effects.skipStep('key')
                })
            ])
        });
    }
}

MiasmaBomb.id = 'miasma-bomb';

module.exports = MiasmaBomb;
