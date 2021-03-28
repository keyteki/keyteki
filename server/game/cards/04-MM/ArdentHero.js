const Card = require('../../Card.js');

class ArdentHero extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context, effectTarget) => {
                if (context.source === effectTarget) {
                    return (
                        context.target &&
                        (context.target.power >= 5 || context.target.hasTrait('mutant'))
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
