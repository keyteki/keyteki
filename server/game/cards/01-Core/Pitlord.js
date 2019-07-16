const Card = require('../../Card.js');

class Pitlord extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.restrictHouseChoice(['dis'])
        });
    }
}

Pitlord.id = 'pitlord';

module.exports = Pitlord;
