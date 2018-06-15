const DrawCard = require('../../drawcard.js');

class SteadfastSamurai extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Can\'t be discarded or remove fate',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'fate' && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            },
            effect: 'stop him being discarded or losing fate in this phase',
            gameAction: ability.actions.cardLastingEffect({
                duration: 'untilEndOfPhase',
                effect: [
                    ability.effects.cardCannot('removeFate'),
                    ability.effects.cardCannot('discardFromPlay')
                ]
            })
        });
    }
}

SteadfastSamurai.id = 'steadfast-samurai';

module.exports = SteadfastSamurai;

