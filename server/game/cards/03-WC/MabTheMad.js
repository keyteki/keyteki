const Card = require('../../Card.js');

class MabTheMad extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.returnToDeck({
                shuffle: true
            })
        });
    }
}

MabTheMad.id = 'mab-the-mad';

module.exports = MabTheMad;
