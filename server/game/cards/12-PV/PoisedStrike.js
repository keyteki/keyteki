const Card = require('../../Card.js');

class PoisedStrike extends Card {
    // After a player readies this creature, destroy it.
    // Fate: Skip your "ready cards" step this turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsReadied: (event, context) => event.cards.includes(context.source.parent)
            },
            gameAction: ability.actions.destroy((context) => ({ target: context.source.parent }))
        });

        this.fate({
            gameAction: ability.actions.untilPlayerTurnEnd(() => ({
                targetController: 'player',
                effect: ability.effects.skipStep('ready')
            }))
        });
    }
}

PoisedStrike.id = 'poised-strike';

module.exports = PoisedStrike;
