const Card = require('../../Card.js');

class Roxador extends Card {
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
