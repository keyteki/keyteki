const Card = require('../../Card.js');

class SowSalt extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'stop creatures from reaping until their next turn',
            gameAction: ability.actions.untilNextTurn({
                targetController: 'any',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

SowSalt.id = 'sow-salt';

module.exports = SowSalt;
