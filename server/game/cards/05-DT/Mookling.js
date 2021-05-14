const Card = require('../../Card.js');

class Mookling extends Card {
    // Your opponent's keys cost +XA, where X is Mookling's power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost((_, context) => context.source.power)
        });
    }
}
Mookling.id = 'mookling';
module.exports = Mookling;
