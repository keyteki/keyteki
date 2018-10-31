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

WorldTree.id = 'world-tree'; // This is a guess at what the id might be - please check it!!!

module.exports = WorldTree;
