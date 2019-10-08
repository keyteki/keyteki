const Card = require('../../Card.js');

class FyreBreath extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Fyre-Breath',
            when: {
                onFight: (event, context) => event.attacker === context.source.parent
            },
            effect: 'deal 2 damage to the neighbors of {0}',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 2,
                target: context.event.attackerTarget.neighbors
            }))
        });
        this.whileAttached({
            effect: ability.effects.modifyPower(3)
        });
    }
}

FyreBreath.id = 'fyre-breath';

module.exports = FyreBreath;
