import Card from '../../Card.js';

class ArchonsCallback extends Card {
    // Omega. (After you play this card, end this step.)
    // Play: Draw 5 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 5 })
        });
    }
}

ArchonsCallback.id = 'archon-s-callback';

export default ArchonsCallback;
