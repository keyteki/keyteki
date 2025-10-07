import Card from '../../Card.js';

class Undagnathus extends Card {
    // (T) While the tide is low, Undagnathus deals no damage when fighting.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isTideLow(),
            effect: ability.effects.limitFightDamage(0)
        });
    }
}

Undagnathus.id = 'undagnathus';

export default Undagnathus;
