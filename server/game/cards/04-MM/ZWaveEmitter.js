const Card = require('../../Card.js');

class ZWaveEmitter extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: (_event, context) => context.player === context.game.activePlayer
                },
                gameAction: ability.actions.ward()
            })
        });
    }
}

ZWaveEmitter.id = 'z-wave-emitter';

module.exports = ZWaveEmitter;
