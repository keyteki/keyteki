const Card = require('../../Card.js');

class Bumpsy extends Card {
    // Play: Your opponent loses 1<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Bumpsy.id = 'bumpsy';

module.exports = Bumpsy;
