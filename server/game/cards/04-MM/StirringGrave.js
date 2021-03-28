const Card = require('../../Card.js');

class StirringGrave extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: ['creature'],
                location: ['discard'],
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

StirringGrave.id = 'stirring-grave';

module.exports = StirringGrave;
