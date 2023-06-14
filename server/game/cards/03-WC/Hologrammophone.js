const Card = require('../../Card.js');

class Hologrammophone extends Card {
    // Action: Ward a creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.ward()
            }
        });
    }
}

Hologrammophone.id = 'hologrammophone';

module.exports = Hologrammophone;
