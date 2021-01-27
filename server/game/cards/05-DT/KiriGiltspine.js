const Card = require('../../Card.js');

class KiriGiltspine extends Card {
    setupCardAbilities(ability) {
        // Elusive.
        // After an enemy creature reaps, it does not ready during its controller's next "ready card" step.
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.type === 'creature'
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.event.card,
                effect: ability.effects.cardCannot(
                    'ready',
                    () =>
                        context.source.controller !== context.game.activePlayer &&
                        context.game.currentPhase === 'ready'
                )
            }))
        });
    }
}

KiriGiltspine.id = 'kiri-giltspine';

module.exports = KiriGiltspine;
