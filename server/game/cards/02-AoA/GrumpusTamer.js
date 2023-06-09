const Card = require('../../Card.js');

class GrumpusTamer extends Card {
    // Reap: Search your deck and discard pile for a War Grumpus, reveal it, and add it to your hand. Then, shuffle your deck.
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
