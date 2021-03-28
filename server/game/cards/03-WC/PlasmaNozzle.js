const Card = require('../../Card.js');

class PlasmaNozzle extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('beforeFight', {
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.event.card,
                    amount: 2,
                    splash: 2
                }))
            })
        });
    }
}

PlasmaNozzle.id = 'plasma-nozzle';

module.exports = PlasmaNozzle;
