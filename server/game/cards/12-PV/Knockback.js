import Card from '../../Card.js';

function discard(deck) {
    const index = deck.findIndex((card) => card.type === 'creature');
    if (index > -1) {
        return { target: deck.slice(0, index + 1) };
    }
    return { target: deck };
}

class Knockback extends Card {
    // Play: Put a creature on top of its owner's deck.
    // Fate: Discard cards from the top of your deck until you discard a creature or run out of cards.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToDeck()
            }
        });

        this.fate({
            gameAction: ability.actions.discard((context) =>
                discard(context.game.activePlayer.deck)
            )
        });
    }
}

Knockback.id = 'knockback';

export default Knockback;
