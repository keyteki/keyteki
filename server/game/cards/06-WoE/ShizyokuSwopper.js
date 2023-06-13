const Card = require('../../Card.js');

class ShizyokuSwopper extends Card {
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => context.event.card.location === 'play area',
            gameAction: [
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.source.controller.opponent)
                })),
                ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    effect: ability.effects.takeControlOn(
                        context.source.controller.opponent.cardsInPlay.indexOf(context.event.card)
                    )
                })),
                ability.actions.cardLastingEffect((context) => ({
                    target: context.event.card,
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.source.controller)
                })),
                ability.actions.cardLastingEffect((context) => ({
                    target: context.event.card,
                    effect: ability.effects.takeControlOn(
                        context.source.controller.cardsInPlay.indexOf(context.source)
                    )
                }))
            ]
        });
    }
}

ShizyokuSwopper.id = 'shĭzyokŭ-swopper';

module.exports = ShizyokuSwopper;
