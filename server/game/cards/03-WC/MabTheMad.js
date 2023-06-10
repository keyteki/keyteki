const Card = require('../../Card.js');

class MabTheMad extends Card {
    // Reap: Shuffle Mab the Mad into your deck.
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
