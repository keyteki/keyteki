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

Fear.id = 'fear'; // This is a guess at what the id might be - please check it!!!

module.exports = Fear;
