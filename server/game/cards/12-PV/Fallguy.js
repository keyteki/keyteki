import Card from '../../Card.js';

class Fallguy extends Card {
    // Taunt.
    // Destroyed: Steal 1.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal()
        });
    }
}

Fallguy.id = 'fallguy';

export default Fallguy;
