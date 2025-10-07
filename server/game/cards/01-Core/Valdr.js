import Card from '../../Card.js';

class Valdr extends Card {
    // Valdr deals +2<D> while attacking an enemy creature on the flank.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.bonusFightDamage((card) => (card.isOnFlank() ? 2 : 0))
        });
    }
}

Valdr.id = 'valdr';

export default Valdr;
