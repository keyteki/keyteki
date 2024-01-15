const Card = require('../../Card.js');

class Thunderdell extends Card {
    // While you are haunted, Thunderdell gains splash-attack 5.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.addKeyword({ 'splash-attack': 5 })
        });
    }
}

Thunderdell.id = 'thunderdell';

module.exports = Thunderdell;
