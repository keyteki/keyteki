const Card = require('../../Card.js');

class Etaromme extends Card {
    // Reap: Destroy a creature of the house with the most creatures in play.
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
