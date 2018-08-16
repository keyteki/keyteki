const Card = require('../../Card.js');

class Bumpsy extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Bumpsy.id = 'bumpsy'; // This is a guess at what the id might be - please check it!!!

module.exports = Bumpsy;
