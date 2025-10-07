import Card from '../../Card.js';

class GracchanReform extends Card {
    // Play: Play the top card of your opponent's deck as if it were yours.
    // Fate: Your opponent archives the top 2 cards of their deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                target: context.player.opponent.deck[0]
            }))
        });

        this.fate({
            gameAction: ability.actions.archive((context) => ({
                target: context.game.activePlayer.opponent.deck.slice(0, 2)
            }))
        });
    }
}

GracchanReform.id = 'gracchan-reform';

export default GracchanReform;
