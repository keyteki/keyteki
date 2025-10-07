import Card from '../../Card.js';

class Pelf extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // After Fight: Your opponent loses 1.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Pelf.id = 'pelf';

export default Pelf;
