const Card = require('../../Card.js');

class Etaromme extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                mode: 'mostHouse',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Etaromme.id = 'etaromme';

module.exports = Etaromme;
