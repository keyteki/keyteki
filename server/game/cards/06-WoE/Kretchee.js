import Card from '../../Card.js';

class Kretchee extends Card {
    // Each time a player exalts a creature or a creature captures , put 1 on that creature from the common supply.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [ability.effects.captureMoreFromPool(1), ability.effects.exaltMoreFromPool(1)]
        });
    }
}

Kretchee.id = 'kretchee';

export default Kretchee;
