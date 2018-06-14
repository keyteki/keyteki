const DrawCard = require('../../drawcard.js');

class MasterOfGiseiToshi extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent non-spell events from being played while contesting a ring',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            effect: 'prevent non-spell events from being played while {0} is contested',
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: 'untilEndOfPhase',
                targetController: 'any',
                condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.ring,
                effect: ability.effects.playerCannot('play', context => context.source.type === 'event' && !context.source.hasTrait('spell'))
            }))
        });
    }
}

MasterOfGiseiToshi.id = 'master-of-gisei-toshi';

module.exports = MasterOfGiseiToshi;
