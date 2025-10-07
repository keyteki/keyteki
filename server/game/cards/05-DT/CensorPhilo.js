import Card from '../../Card.js';

class CensorPhilo extends Card {
    // Censor Philo cannot be dealt damage by creatures with A on them.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context, effectContext) => {
                if (context.source === effectContext.source) {
                    return context.target && context.target.amber > 0;
                }
                return context.source.type === 'creature' && context.source.amber > 0;
            })
        });
    }
}

CensorPhilo.id = 'censor-philo';

export default CensorPhilo;
