const Card = require('../../Card.js');

class EliteDisruptzord extends Card {
    // Creatures more powerful than Elite Disruptzord cannot be played.
    setupCardAbilities(ability) {
        this.persistentEffect({
            // condition: (card) => card.type === 'creature' && card.power > 6,
            targetController: 'any',
            // effect: ability.effects.playerCannot('play', () => false)
            effect: ability.effects.playerCannot(
                'play',
                // effectContext.source.power is ED
                // context.source.power is creature
                // (context, effectContext) => context.source.power === 5
                // (context, effectContext) =>   context.source.power < effectContext.source.power
                // (context, effectContext) =>   context.source.power < effectContext.source.power
                (context, effectContext) => effectContext.source.power < context.source.power
            )

            // effect: ability.effects.cardCannot('damage', (context, effectContext) => {
            //     if (context.source === effectContext.source) {
            //         return context.target && context.target.amber > 0;
            //     }
            //     return context.source.type === 'creature' && context.source.amber > 0;
            // })
        });
    }
}

EliteDisruptzord.id = 'elite-disruptzord';

module.exports = EliteDisruptzord;
