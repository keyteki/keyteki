const Card = require('../../Card.js');

class PhaseShift extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'allow them to play one non-Logos card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse('logos')
            })
        });
    }
}

PhaseShift.id = 'phase-shift';

module.exports = PhaseShift;
