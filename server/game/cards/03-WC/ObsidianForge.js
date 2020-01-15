const Card = require('../../Card.js');

class ObsidianForge extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: context =>
                context.player.creaturesInPlay.length > 0,
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
                gameAction: ability.actions.forgeKey(context => ({
                    modifier: 6 - context.preThenEvents.filter(event =>
                        !event.cancelled && event.destroyEvent && !event.destroyEvent.cancelled).length
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
