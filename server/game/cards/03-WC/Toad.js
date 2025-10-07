import Card from '../../Card.js';

class Toad extends Card {
    // Toad cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Toad.id = 'toad';

export default Toad;
