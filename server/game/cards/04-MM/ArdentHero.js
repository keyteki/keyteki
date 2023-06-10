const Card = require('../../Card.js');

class ArdentHero extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Ardent Hero cannot be dealt damage by Mutant creatures or creatures with power 5 or higher.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context, effectContext, event) => {
                if (context.source === effectContext.source) {
                    return (
                        context.target &&
                        (context.target.power >= 5 || context.target.hasTrait('mutant'))
                    );
                }
                if (event && event.card === effectContext.source) {
                    return (
                        event.damageSource &&
                        event.damageSource.type === 'creature' &&
                        (event.damageSource.power >= 5 || event.damageSource.hasTrait('mutant'))
                    );
                }

                return (
                    context.source.type === 'creature' &&
                    (context.source.power >= 5 || context.source.hasTrait('mutant'))
                );
            })
        });
    }
}

ArdentHero.id = 'ardent-hero';

module.exports = ArdentHero;
