const DrawCard = require('../../drawcard.js');

class SecludedShrine extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Count a ring as claimed',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} - the {2} ring is considered to be claimed by {0} until the end of the phase', context.player, context.source, context.ring.element);
                this.untilEndOfPhase(ability => ({
                    match: context.ring,
                    targetType: 'ring',
                    effect: ability.effects.addRingEffect('considerAsClaimed', player => player === context.player)
                }));
            }
        });
    }
}

SecludedShrine.id = 'secluded-shrine'; 

module.exports = SecludedShrine;
