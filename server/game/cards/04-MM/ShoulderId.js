const Card = require('../../Card.js');

class ShoulderId extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Shoulder Id cannot fight.
    // When Shoulder Id would deal damage, steal 1 instead.
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
