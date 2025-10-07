import Card from '../../Card.js';

class StasisNexus extends Card {
    // Action: Purge Stasis Nexus. If you do, forge a key at +6 current cost, reduced by 1 for each stunned creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.purge((context) => ({
                target: context.source
            })),
            then: {
                may: 'forge a key',
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier: 6 - context.game.creaturesInPlay.filter((card) => card.stunned).length
                }))
            }
        });
    }
}

StasisNexus.id = 'stasis-nexus';

export default StasisNexus;
