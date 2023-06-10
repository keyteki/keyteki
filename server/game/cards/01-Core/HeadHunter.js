const Card = require('../../Card.js');

class Headhunter extends Card {
    // Fight: Gain 1<A>.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber()
        });
    }
}

Headhunter.id = 'headhunter';

module.exports = Headhunter;
