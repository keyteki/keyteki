const Card = require('../../Card.js');

class DeEscalation extends Card {
    // Play: Destroy each creature. Your opponent archives the top 3
    // cards of their deck.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy all creatures{1}',
            effectArgs: (context) => [
                context.player.opponent
                    ? ' and have ' +
                      context.player.opponent.name +
                      ' archive the top 3 cards of their deck'
                    : ''
            ],
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
                ability.actions.conditional((context) => ({
                    condition: context.player.opponent && context.player.opponent.deck.length > 0,
                    trueGameAction: ability.actions.archive({
                        target: context.player.opponent.deck.slice(
                            0,
                            Math.min(context.player.deck.length, 3)
                        )
                    })
                }))
            ])
        });
    }
}

DeEscalation.id = 'de-escalation';

module.exports = DeEscalation;
