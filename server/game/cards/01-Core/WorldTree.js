const Card = require('../../Card.js');

class WorldTree extends Card {
    // Action: Return a creature from your discard pile to the top of your deck.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

WorldTree.id = 'world-tree';

module.exports = WorldTree;
