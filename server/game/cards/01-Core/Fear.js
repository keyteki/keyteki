const Card = require('../../Card.js');

class Fear extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Fear.id = 'fear';

module.exports = Fear;
