const StrongholdCard = require('../../strongholdcard.js');

class HisuMoriToride extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain additional military conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   event.conflict.skillDifference >= 5
            },
            cost: [ability.costs.bowSelf(), ability.costs.sacrifice(card => card.hasTrait('bushi'))],
            gameAction: ability.actions.playerLastingEffect({
                duration: 'untilEndOfPhase',
                effect: ability.effects.additionalConflict('military')
            })
        });
    }
}

HisuMoriToride.id = 'hisu-mori-toride';

module.exports = HisuMoriToride;
