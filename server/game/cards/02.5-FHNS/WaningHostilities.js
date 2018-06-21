const DrawCard = require('../../drawcard.js');

class WaningHostilities extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Both players may only declare 1 conflict opportunity this turn',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            effect: 'limit both players to a single conflict this turn',
            gameAction: ability.actions.playerLastingEffect({
                duration: 'untilEndOfPhase',
                effect: ability.effects.setMaxConflicts(1)
            })
        });
    }
}

WaningHostilities.id = 'waning-hostilities';

module.exports = WaningHostilities;
