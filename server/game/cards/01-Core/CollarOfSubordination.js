const Card = require('../../Card.js');

class CollarOfSubordination extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.takeControl(this.controller)
        });
    }
}

CollarOfSubordination.id = 'collar-of-subordination'; // This is a guess at what the id might be - please check it!!!

module.exports = CollarOfSubordination;
