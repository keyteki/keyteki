const Card = require('../../Card.js');

class Pitlord extends Card {
    // Taunt.(This creatures neighbors cannot be attacked unless they have taunt.)
    // While Pitlord is in play, you must choose Dis as your active house.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.restrictHouseChoice(['dis'])
        });
    }
}

Pitlord.id = 'pitlord';

module.exports = Pitlord;
