const Card = require('../../Card.js');

class ObsidianForge extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'unlimited',
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.sacrifice()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey((context) => ({
                    may: true,
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
