const Card = require('../../Card.js');

class Labwork extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Labwork.id = 'labwork'; // This is a guess at what the id might be - please check it!!!

module.exports = Labwork;
