const Card = require('../../Card.js');

class ArdentHero extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context) => {
                return context.source.power >= 5 || context.source.hasTrait('mutant');
            })
        });
        this.persistentEffect({
            targetController: 'opponent',
            match: () => true,
            effect: ability.effects.cardCannot('dealFightDamageWhenDefending', (context) => {
                return (
                    context.target &&
                    (context.target.power >= 5 || context.target.hasTrait('mutant'))
                );
            })
        });
    }
}

ArdentHero.id = 'ardent-hero';

module.exports = ArdentHero;
