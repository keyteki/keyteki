const Card = require('../../Card.js');

class ObsidianForge extends Card {
    // Action: Destroy any number of friendly creatures. You may forge a key at +6A current cost, reduced by 1A for each creature destroyed this way. If you forge a key this way, destroy Obsidian Forge.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'unlimited',
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.sacrifice()
            },
            then: {
                may: 'forge a key',
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier: 6 - context.preThenEvents.filter((event) => !event.cancelled).length
                })),
                then: {
                    gameAction: ability.actions.sacrifice()
                }
            }
        });
    }
}

ObsidianForge.id = 'obsidian-forge';

module.exports = ObsidianForge;
