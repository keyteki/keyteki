const Card = require('../../Card.js');

class ShieldOfJustice extends Card {
    // Play: For the remainder of the turn, each friendly creature cannot be dealt damage.
    setupCardAbilities(ability) {
        this.play({
            effect: 'prevent their creatures from taking damage this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.cardCannot('damage')
            })
        });
    }
}

ShieldOfJustice.id = 'shield-of-justice';

module.exports = ShieldOfJustice;
