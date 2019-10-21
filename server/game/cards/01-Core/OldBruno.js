const Card = require('../../Card.js');

class OldBruno extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

OldBruno.id = 'old-bruno';

module.exports = OldBruno;
