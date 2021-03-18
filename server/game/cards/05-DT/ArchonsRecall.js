const Card = require('../../Card.js');

class ArchonsRecall extends Card {
    //Omega.
    //Play: Draw 5 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 5 })
        });
    }
}

ArchonsRecall.id = 'archon-s-recall';

module.exports = ArchonsRecall;
