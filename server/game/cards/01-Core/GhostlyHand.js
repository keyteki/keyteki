import Card from '../../Card.js';

class GhostlyHand extends Card {
    // Play: If your opponent has exactly 1<A>, steal it.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber === 1,
            gameAction: ability.actions.steal()
        });
    }
}

GhostlyHand.id = 'ghostly-hand';

export default GhostlyHand;
