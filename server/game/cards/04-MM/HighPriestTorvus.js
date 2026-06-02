const Card = require('../../Card.js');

class HighPriestTorvus extends Card {
    // Reap: You may exalt High Priest Torvus. If you do, after you resolve your next action card this turn, return it to your hand instead of placing it in your discard pile.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.untilPlayerTurnEnd((context) => {
                    // Capture all cards currently resolving (in 'being played')
                    // so we don't return them to hand — only the NEXT action counts.
                    const excludeCards = context.game.allCards.filter(
                        (c) => c.location === 'being played'
                    );
                    return {
                        when: {
                            onCardPlayed: (event) =>
                                event.player === context.player &&
                                event.card.type === 'action' &&
                                !excludeCards.includes(event.card)
                        },
                        effect: 'return {1} to hand instead of placing it in discard pile',
                        effectArgs: (context) => context.event.card,
                        multipleTrigger: false,
                        gameAction: ability.actions.cardLastingEffect((context) => ({
                            allowedLocations: 'any',
                            target: context.event.card,
                            effect: ability.effects.cardLocationAfterPlay('hand')
                        }))
                    };
                })
            }
        });
    }
}

HighPriestTorvus.id = 'high-priest-torvus';

module.exports = HighPriestTorvus;
