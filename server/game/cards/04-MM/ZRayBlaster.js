const Card = require('../../Card.js');

class ZRayBlaster extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('beforeFight', {
                    effect: 'deal 3 damage to the neighbors of {0}',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: 3,
                        target: context.event.card.neighbors
                    }))
                }),
                ability.effects.modifyPower(3)
            ]
        });
    }
}

ZRayBlaster.id = 'z-ray-blaster';

module.exports = ZRayBlaster;
