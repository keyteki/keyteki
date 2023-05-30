const Card = require('../../Card.js');

class SkullbackCrab extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

SkullbackCrab.id = 'skullback-crab';

module.exports = SkullbackCrab;
