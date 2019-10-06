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

Hologrammophone.id = 'hologrammophone'; // This is a guess at what the id might be - please check it!!!

module.exports = Hologrammophone;
