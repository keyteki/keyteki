const Card = require('../../Card.js');

class DeDoss extends Card {
    // This creature gains, “Your opponent cannot play creatures more
    // powerful than this creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.playerCannot(
                    'play',
                    (context, effectContext) => effectContext.source.power < context.source.power
                )
            })
        });
    }
}

DeDoss.id = 'de-doss';

module.exports = DeDoss;
