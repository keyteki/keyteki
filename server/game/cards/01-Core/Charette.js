const Card = require('../../Card.js');

class Charette extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

Charette.id = 'charette'; // This is a guess at what the id might be - please check it!!!

module.exports = Charette;
