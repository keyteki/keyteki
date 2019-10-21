const Card = require('../../Card.js');

class Urchin extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal()
        });
    }
}

Urchin.id = 'urchin';

module.exports = Urchin;
