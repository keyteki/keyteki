const Card = require('../../Card.js');

class FeedingPit extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

FeedingPit.id = 'feeding-pit';

module.exports = FeedingPit;
