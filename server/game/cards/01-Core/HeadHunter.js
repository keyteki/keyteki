const Card = require('../../Card.js');

class Headhunter extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.gainAmber()
        });
    }
}

Headhunter.id = 'headhunter'; // This is a guess at what the id might be - please check it!!!

module.exports = Headhunter;
