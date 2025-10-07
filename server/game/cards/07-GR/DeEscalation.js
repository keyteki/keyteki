import Card from '../../Card.js';

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
                ability.actions.archive((context) => ({
                    target: context.player.opponent ? context.player.opponent.deck.slice(0, 3) : []
                }))
            ])
        });
    }
}

DeEscalation.id = 'de-escalation';

export default DeEscalation;
