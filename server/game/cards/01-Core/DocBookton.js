const Card = require('../../Card.js');

class DocBookton extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw()
        });
    }
}

DocBookton.id = 'doc-bookton';

module.exports = DocBookton;
