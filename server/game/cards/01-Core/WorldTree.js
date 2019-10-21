const Card = require('../../Card.js');

class WorldTree extends Card {
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
