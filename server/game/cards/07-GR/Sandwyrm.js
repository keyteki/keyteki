const Card = require('../../Card.js');

class Sandwyrm extends Card {
    // After Fight: Shuffle Sandwyrm into your deck.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.returnToDeck({
                shuffle: true
            })
        });
    }
}

Sandwyrm.id = 'sandwyrm';

module.exports = Sandwyrm;
