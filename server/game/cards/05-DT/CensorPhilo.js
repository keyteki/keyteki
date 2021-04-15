const Card = require('../../Card.js');

class CensorPhilo extends Card {
    // Censor Philo cannot be dealt damage by creatures with A on them.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context, effectTarget) => {
                if (context.source === effectTarget) {
                    return context.target && context.target.amber > 0;
                }
                return context.source.type === 'creature' && context.source.amber > 0;
            })
        });
    }
}

CensorPhilo.id = 'censor-philo';

module.exports = CensorPhilo;
