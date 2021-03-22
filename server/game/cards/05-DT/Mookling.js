const Card = require('../../Card.js');

class Mookling extends Card {
    // Your opponent's keys cost +X A, where X is Mookling's power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost((_, context) => context.source.getPower(false))
        });
    }
}
Mookling.id = 'mookling';
module.exports = Mookling;
