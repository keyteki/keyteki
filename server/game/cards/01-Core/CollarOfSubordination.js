const Card = require('../../Card.js');

class CollarOfSubordination extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.takeControl(this.controller)
        });
    }
}

CollarOfSubordination.id = 'collar-of-subordination';

module.exports = CollarOfSubordination;
