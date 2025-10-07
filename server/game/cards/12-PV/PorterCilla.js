import Card from '../../Card.js';
import _ from 'underscore';

class PorterCilla extends Card {
    // After Reap: Put a random card from your opponent's hand on top of their deck.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent && context.player.opponent.hand.length > 0,
            gameAction: ability.actions.returnToDeck((context) => ({
                target: _.shuffle(context.player.opponent.hand).slice(0, 1)
            }))
        });
    }
}

PorterCilla.id = 'porter-cilla';

export default PorterCilla;
