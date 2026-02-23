import Card from '../../Card.js';
class DaemoThief extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DaemoThief.id = 'dæmo-thief';

export default DaemoThief;
