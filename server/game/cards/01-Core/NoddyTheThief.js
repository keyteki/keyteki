const Card = require('../../Card.js');

class NoddyTheThief extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

NoddyTheThief.id = 'noddy-the-thief'; // This is a guess at what the id might be - please check it!!!

module.exports = NoddyTheThief;
