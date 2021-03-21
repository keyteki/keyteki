const Card = require('../../Card.js');

class Mookling extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() => this.getPower(false))
        });
    }
}

Mookling.id = 'mookling';

module.exports = Mookling;
