import Card from '../../Card.js';

class Scholar extends Card {
    //After Reap: Draw 1 card.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw()
        });
    }
}

Scholar.id = 'scholar';

export default Scholar;
