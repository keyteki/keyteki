const Card = require('../../Card.js');

class Rotfeast extends Card {
    // Play: For the remainder of the turn, gain 1 each time a
    // creature is dealt damage.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'gain 1 amber each time a creature is dealt damage for the remainder of the turn',
            gameAction: ability.actions.untilEndOfPlayerTurn({
                when: {
                    onDamageApplied: (event) => event.amount > 0
                },
                gameAction: ability.actions.gainAmber((context) => ({ target: context.player }))
            })
        });
    }
}

Rotfeast.id = 'rotfeast';

module.exports = Rotfeast;
