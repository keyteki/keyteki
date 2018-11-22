const Card = require('../../Card.js');

class PhaseShift extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.play({
            effect: 'allow them to play one non-Logos card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse('logos')
            })
        });
    }
}

PhaseShift.id = 'phase-shift'; // This is a guess at what the id might be - please check it!!!

module.exports = PhaseShift;
