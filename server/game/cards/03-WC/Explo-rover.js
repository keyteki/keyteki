const Card = require('../../Card.js');

class ExploRover extends Card {
    setupCardAbilities(ability) {
        this.canPlayAsUpgrade = true;
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 })
            ]
        });
    }
}

ExploRover.id = 'explo-rover';

module.exports = ExploRover;
