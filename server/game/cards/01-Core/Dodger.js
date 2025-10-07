import Card from '../../Card.js';

class Dodger extends Card {
    // Fight: Steal 1<A>.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Dodger.id = 'dodger';

export default Dodger;
