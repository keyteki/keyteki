const Card = require('../../Card.js');

class ShiftingBattlefield extends Card {
    // Play: Move a friendly creature anywhere in your battleline. That creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.moveOnBattleline((context) => ({
                        player: context.player
                    })),
                    ability.actions.capture()
                ])
            }
        });
    }
}

ShiftingBattlefield.id = 'shifting-battlefield';

module.exports = ShiftingBattlefield;
