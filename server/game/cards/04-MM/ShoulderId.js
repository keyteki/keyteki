const Card = require('../../Card.js');

class ShoulderId extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('fight'),
                ability.effects.replaceDamage(
                    ability.actions.steal(),
                    (damageSource) => damageSource.controller.opponent
                )
            ]
        });
    }
}

ShoulderId.id = 'shoulder-id';

module.exports = ShoulderId;
