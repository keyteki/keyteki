const Card = require('../../Card.js');

class CornistOctavia extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

CornistOctavia.id = 'cornist-octavia';

module.exports = CornistOctavia;
