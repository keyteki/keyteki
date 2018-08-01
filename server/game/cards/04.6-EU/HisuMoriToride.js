const StrongholdCard = require('../../strongholdcard.js');

class HisuMoriToride extends StrongholdCard {
    setupCardAbilities(ability) {

        this.reaction({
            title: 'Gain additional military conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            },
            cost: [ability.costs.bowSelf(), ability.costs.sacrifice(card => card.hasTrait('cavalry'))],
            gameAction: ability.actions.playerLastingEffect({
                duration: 'untilEndOfPhase',
                effect: ability.effects.additionalConflict('military')
            })
        });
    }
}

HisuMoriToride.id = 'hisu-mori-toride-elements-unbound';

module.exports = HisuMoriToride;
