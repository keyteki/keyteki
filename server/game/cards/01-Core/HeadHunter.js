const Card = require('../../Card.js');

class Headhunter extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber()
        });
    }
}

Headhunter.id = 'headhunter';

module.exports = Headhunter;
