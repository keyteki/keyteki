const Card = require('../../Card.js');

class NoddyTheThief extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

NoddyTheThief.id = 'noddy-the-thief';

module.exports = NoddyTheThief;
