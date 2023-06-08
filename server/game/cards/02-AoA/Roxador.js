const Card = require('../../Card.js');

class Roxador extends Card {
    // Skirmish.(When you use this creature to fight, it is dealt no damage in return.)
    // Roxador only deals 2D when fighting.
    // Fight: Stun the attacked creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.limitFightDamage(2)
        });
        this.fight({
            gameAction: ability.actions.stun((context) => ({ target: context.event.card }))
        });
    }
}

Roxador.id = 'roxador';

module.exports = Roxador;
