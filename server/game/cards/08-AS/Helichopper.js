const Card = require('../../Card.js');

class Helichopper extends Card {
    // If you are haunted, Helichopper gets +3 power for each A on
    // it.
    // Action: Capture 2A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.modifyPower((card) => 3 * card.amber)
        });

        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

Helichopper.id = 'helichopper';

module.exports = Helichopper;
