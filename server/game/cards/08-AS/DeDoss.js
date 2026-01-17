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
                        // If a creature C1 is using an ability to play
                        // another creature C2, this effect match will be
                        // called once with C1 as the context, instead of
                        // C2, and we shouldn't disallow the play in that
                        // case.  The only way to figure that out is by
                        // checking the context source's location.
                        context.source.location !== 'play area' &&
                        context.source.type === 'creature' &&
                        effectContext.source.power < context.source.getGiganticCombinedPower()
                )
            })
        });
    }
}

DeDoss.id = 'de-doss';

module.exports = DeDoss;
