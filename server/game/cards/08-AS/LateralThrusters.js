const Card = require('../../Card.js');

class LateralThrusters extends Card {
    // This creature gains, “At the start of your turn, you may
    // rearrange the creatures in your battleline.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onTurnStart: (_event, context) => context.player === context.game.activePlayer
                },
                gameAction: ability.actions.rearrangeBattleline((context) => ({
                    player: context.player
                }))
            })
        });
    }
}

LateralThrusters.id = 'lateral-thrusters';

module.exports = LateralThrusters;
