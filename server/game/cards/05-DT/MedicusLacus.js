import Card from '../../Card.js';

class MedicusLacus extends Card {
    // (T) While the tide is high, you may spend A on friendly creatures as if it were in your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            match: (card) => card.type === 'creature',
            effect: ability.effects.keyAmber()
        });
    }
}

MedicusLacus.id = 'medicus-lacus';

export default MedicusLacus;
