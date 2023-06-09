const Card = require('../../Card.js');

class SowSalt extends Card {
    // Alpha.
    // Play: Until the start of your next turn, creatures cannot reap.
    setupCardAbilities(ability) {
        this.play({
            effect: 'stop creatures from reaping until their next turn',
            effectAlert: true,
            gameAction: ability.actions.untilNextTurn({
                targetController: 'any',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

SowSalt.id = 'sow-salt';

module.exports = SowSalt;
