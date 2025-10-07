import Card from '../../Card.js';

class PoisedStrike extends Card {
    // After a player readies this creature, destroy it.
    // Fate: Skip your "ready cards" step this turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardReadied: (event, context) =>
                    event.card === context.source.parent && event.exhausted
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

export default PoisedStrike;
