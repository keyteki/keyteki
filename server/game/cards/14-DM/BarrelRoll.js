const Card = require('../../Card.js');

class BarrelRoll extends Card {
    // Play: Move a creature to a flank of its controller's battleline and exhaust it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.moveToFlank(),
                    ability.actions.exhaust()
                ])
            }
        });
    }
}

BarrelRoll.id = 'barrel-roll';

module.exports = BarrelRoll;
