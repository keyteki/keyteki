import Card from '../../Card.js';

class Troll extends Card {
    // Reap: Troll heals 3 damage.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.heal({ amount: 3 })
        });
    }
}

Troll.id = 'troll';

export default Troll;
