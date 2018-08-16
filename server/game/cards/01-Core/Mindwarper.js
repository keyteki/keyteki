const Card = require('../../Card.js');

class Mindwarper extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture()
            }
        });
    }
}

Mindwarper.id = 'mindwarper'; // This is a guess at what the id might be - please check it!!!

module.exports = Mindwarper;
