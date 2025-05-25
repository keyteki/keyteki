const Card = require('../../Card.js');

class PoisedStrike extends Card {
    // After this creature is used, destroy it.
    // Fate: Skip your "ready cards" step this turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.destroy((context) => ({ target: context.source.parent }))
        });

        this.fate({
            gameAction: ability.actions.untilNextTurn((context) => ({
                target: context.game.activePlayer,
                effect: ability.effects.doesNotReady()
            }))
        });
    }
}

PoisedStrike.id = 'poised-strike';

module.exports = PoisedStrike;
