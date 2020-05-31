const Card = require('../../Card.js');

class ObsidianForge extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                optional: true,
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
