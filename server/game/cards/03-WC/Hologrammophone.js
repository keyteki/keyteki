const Card = require('../../Card.js');

class Hologrammophone extends Card {
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
