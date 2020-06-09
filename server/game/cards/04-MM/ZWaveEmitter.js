const Card = require('../../Card.js');

class ZWaveEmitter extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
            },
            gameAction: ability.actions.ward((context) => ({
                target: context.source.parent
            }))
        });
    }
}

ZWaveEmitter.id = 'z-wave-emitter';

module.exports = ZWaveEmitter;
