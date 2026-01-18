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
                    (context, effectContext) =>
                        context.source.type === 'creature' &&
                        effectContext.source.power < context.source.getPower({ restriction: true })
                )
            })
        });
    }
}

DeDoss.id = 'de-doss';

module.exports = DeDoss;
