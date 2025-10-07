import Card from '../../Card.js';

class Silvertooth extends Card {
    // Silvertooth enters play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });
    }
}

Silvertooth.id = 'silvertooth';

export default Silvertooth;
