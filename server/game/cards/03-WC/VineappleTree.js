const Card = require('../../Card.js');

class VineappleTree extends Card {
    // Keys cost +1A for each growth counter on Vineapple Tree.
    // After a key is forged, remove each growth counter from Vineapple Tree.
    // Action: Put a growth counter on Vineapple Tree.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.addGrowthCounter()
        }),
            this.persistentEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(() => this.tokens.growth || 0)
            });
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            effect: 'remove all growth counters from Vineapple Tree',
            gameAction: ability.actions.clearGrowthTokens({
                all: true
            })
        });
    }
}

VineappleTree.id = 'vineapple-tree';

module.exports = VineappleTree;
