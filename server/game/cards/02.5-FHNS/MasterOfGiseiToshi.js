const DrawCard = require('../../drawcard.js');

class MasterOfGiseiToshi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent non-spell events from being played while contesting a ring',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to prevent non-spell events from being played while the {2} ring is contested', context.player, this, context.ring.element);                
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'any',
                    condition: () => this.game.currentConflict && this.game.currentConflict.conflictRing === context.ring.element,
                    effect: ability.effects.cannotPlay(context => context && context.source.type === 'event' && !context.source.hasTrait('spell'))
                }));
            }
        });
    }
}

MasterOfGiseiToshi.id = 'master-of-gisei-toshi';

module.exports = MasterOfGiseiToshi;
