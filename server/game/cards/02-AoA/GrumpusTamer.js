const Card = require('../../Card.js');

class GrumpusTamer extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.search({
                cardName: 'War Grumpus',
                amount: 1
            })
        });
    }
}

GrumpusTamer.id = 'grumpus-tamer';

module.exports = GrumpusTamer;
