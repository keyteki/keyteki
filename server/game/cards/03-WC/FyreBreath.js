const Card = require('../../Card.js');

class FyreBreath extends Card {
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
