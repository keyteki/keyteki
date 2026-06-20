const Card = require('../../Card.js');

class HighPriestTorvus extends Card {
    // Reap: You may exalt High Priest Torvus. If you do, after you resolve your next action card this turn, return it to your hand instead of placing it in your discard pile.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.delayedEffect((context) => {
                    // Capture all cards currently resolving (in 'being played')
                    // so we don't return them to hand — only the NEXT action counts.
                    const excludeCards = context.game.allCards.filter(
                        (c) => c.location === 'being played'
                    );
                    return {
                        target: context.source,
                        when: {
                            onCardPlayed: (event) =>
                                event.player === context.player &&
                                event.card.type === 'action' &&
                                !excludeCards.includes(event.card)
                        },
                        multipleTrigger: false,
                        handler: (event) => {
                            context.game.addMessage(
                                '{0} uses {1} to return {2} to their hand instead of placing it in the discard pile',
                                context.player,
                                context.source,
                                event.card
                            );
                            const effectContext = context.copy();
                            effectContext.event = event;
                            ability.actions
                                .cardLastingEffect({
                                    allowedLocations: 'any',
                                    target: event.card,
                                    effect: ability.effects.cardLocationAfterPlay('hand')
                                })
                                .resolve(event.card, effectContext);
                        }
                    };
                })
            }
        });
    }
}

HighPriestTorvus.id = 'high-priest-torvus';

module.exports = HighPriestTorvus;
