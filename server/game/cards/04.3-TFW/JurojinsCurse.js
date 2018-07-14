const DrawCard = require('../../drawcard.js');
const FatePhase = require('../../gamesteps/fatephase.js');

class JurojinsCurse extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Resolve a second fate phase',
            when: {
                onPhaseEnded: (event, context) => event.phase === 'fate' && !context.source.parent.bowed
            },
            effect: 'resolve a second fate phase after this',
            handler: context => context.source.delayedEffect(() => ({
                when: {
                    onPhaseEnded: event => event.phase === 'fate'
                },
                context: context,
                handler: () => {
                    context.game.queueStep(new FatePhase(this.game));
                    context.game.addMessage('{0} takes hold!', context.source);
                }
            })),
            max: ability.limit.perRound(1)
        });
    }
}

JurojinsCurse.id = 'jurojin-s-curse';

module.exports = JurojinsCurse;
