import Card from '../../Card.js';

class Groke extends Card {
    // Fight: Your opponent loses 1A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Groke.id = 'groke';

export default Groke;
