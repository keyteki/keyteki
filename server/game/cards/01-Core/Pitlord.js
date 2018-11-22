const Card = require('../../Card.js');

class Pitlord extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.restrictHouseChoice(['dis'])
        });
    }
}

Pitlord.id = 'pitlord'; // This is a guess at what the id might be - please check it!!!

module.exports = Pitlord;
