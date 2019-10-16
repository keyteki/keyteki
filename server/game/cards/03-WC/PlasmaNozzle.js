const Card = require('../../Card.js');

class PlasmaNozzle extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('interrupt', {
                when: {
                    onFight: (event, context) => event.attacker === context.source
                },
                gameAction: ability.actions.dealDamage(context => ({
                    target: context.event.card.neighbors.concat(context.event.card),
                    amount: 2
                }))
            })
        });
    }
}

PlasmaNozzle.id = 'plasma-nozzle';

module.exports = PlasmaNozzle;
