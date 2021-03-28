const Card = require('../../Card.js');

class ExploRover extends Card {
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
