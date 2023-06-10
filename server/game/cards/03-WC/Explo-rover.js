const Card = require('../../Card.js');

class ExploRover extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Explo-rover may be played as an upgrade instead of a creature, with the text: This creature gains skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

ExploRover.id = 'explo-rover';

module.exports = ExploRover;
