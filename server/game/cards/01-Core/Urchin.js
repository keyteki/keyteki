const Card = require('../../Card.js');

class Urchin extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal()
        });
    }
}

Urchin.id = 'urchin'; // This is a guess at what the id might be - please check it!!!

module.exports = Urchin;
