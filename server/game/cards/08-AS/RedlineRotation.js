import Card from '../../Card.js';

class RedlineRotation extends Card {
    // Play: If your opponent has 7A or more, steal half of their A
    // (rounding down).
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.steal((context) => ({
                amount: Math.floor(context.player.opponent.amber / 2)
            }))
        });
    }
}

RedlineRotation.id = 'redline-rotation';

export default RedlineRotation;
