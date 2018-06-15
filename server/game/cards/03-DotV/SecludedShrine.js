const DrawCard = require('../../drawcard.js');

class SecludedShrine extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Count a ring as claimed',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            target: {
                mode: 'ring',
                ringCondition: () => true,
                gameAction: ability.actions.ringLastingEffect(context => ({
                    duration: 'untilEndOfPhase',
                    effect: ability.effects.considerRingAsClaimed(player => player === context.player)
                }))
            },
            effect: 'make it so that they are considered to have claimed {0} until the end of the phase'
        });
    }
}

SecludedShrine.id = 'secluded-shrine';

module.exports = SecludedShrine;
