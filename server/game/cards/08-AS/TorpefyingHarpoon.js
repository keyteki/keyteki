const Card = require('../../Card.js');

class TorpefyingHarpoon extends Card {
    // This creature gains, “At the end of your turn, if this creature
    // is not on a flank, destroy it.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('interrupt', {
                when: {
                    onTurnEnded: (_event, context) =>
                        context.player === context.game.activePlayer && !context.source.isOnFlank()
                },
                gameAction: ability.actions.destroy()
            })
        });
    }
}

TorpefyingHarpoon.id = 'torpefying-harpoon';

module.exports = TorpefyingHarpoon;
