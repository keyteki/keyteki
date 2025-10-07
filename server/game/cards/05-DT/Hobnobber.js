import Card from '../../Card.js';

class Hobnobber extends Card {
    // Action: If your opponent has 6A or more, steal 2A.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 6,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

Hobnobber.id = 'hobnobber';

export default Hobnobber;
