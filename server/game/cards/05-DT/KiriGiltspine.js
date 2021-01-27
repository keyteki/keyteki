const Card = require('../../Card.js');

class KiriGiltspine extends Card {
    setupCardAbilities(ability) {
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
                    () => context.game.currentPhase === 'ready'
                )
            }))
        });
    }
}

KiriGiltspine.id = 'kiri-giltspine';

module.exports = KiriGiltspine;
