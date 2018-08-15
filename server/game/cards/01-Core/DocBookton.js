const Card = require('../../Card.js');

class DocBookton extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw()
        });
    }
}

DocBookton.id = 'doc-bookton'; // This is a guess at what the id might be - please check it!!!

module.exports = DocBookton;
