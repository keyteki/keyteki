import Card from '../../Card.js';

class Thalassophobia extends Card {
    // Play: Discard the top 10 cards of your opponent's deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(
                    0,
                    Math.min(context.player.opponent.deck.length, 10)
                ),
                location: 'deck'
            }))
        });
    }
}

Thalassophobia.id = 'thalassophobia';

export default Thalassophobia;
