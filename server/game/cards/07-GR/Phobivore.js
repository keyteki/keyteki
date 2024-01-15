const Card = require('../../Card.js');

class Phobivore extends Card {
    // This creature gains “While you are haunted, this creature
    // cannot be used.”
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.source.parent.controller.isHaunted(),
            effect: ability.effects.cardCannot('use')
        });
    }
}

Phobivore.id = 'phobivore';

module.exports = Phobivore;
