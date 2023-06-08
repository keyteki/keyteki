const Card = require('../../Card.js');

class FyreBreath extends Card {
    // This creature gets +3 power and gains, Before Fight: Deal 2D to each neighbor of the creature this creature fights.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('beforeFight', {
                    effect: 'deal 2 damage to the neighbors of {0}',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 2,
                        target: context.event.card.neighbors
                    }))
                }),
                ability.effects.modifyPower(3)
            ]
        });
    }
}

FyreBreath.id = 'fyre-breath';

module.exports = FyreBreath;
