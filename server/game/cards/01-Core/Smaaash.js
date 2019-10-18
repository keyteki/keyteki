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

Smaaash.id = 'smaaash';

module.exports = Smaaash;
