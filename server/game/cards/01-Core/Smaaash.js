const Card = require('../../Card.js');

class Smaaash extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });
    }
}

Smaaash.id = 'smaaash'; // This is a guess at what the id might be - please check it!!!

module.exports = Smaaash;
