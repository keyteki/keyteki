const Card = require('../../Card.js');

class HighPriestTorvus extends Card {
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onCardPlayed: (event) =>
                            event.player === context.player && event.card.type === 'action'
                    },
                    effect: 'return {1} to hand instead of placing it in discard pile',
                    effectArgs: (context) => context.event.card,
                    multipleTrigger: false,
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        targetLocation: 'any',
                        target: context.event.card,
                        effect: ability.effects.actionCardLocationAfterPlay('hand')
                    }))
                }))
            }
        });
    }
}

HighPriestTorvus.id = 'high-priest-torvus';

module.exports = HighPriestTorvus;
