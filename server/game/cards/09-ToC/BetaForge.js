const Card = require('../../Card.js');

class BetaForge extends Card {
    // Action: Make an Alpha-Gamma. You may forge a key at +12A
    // current cost, reduced by 1A for each card in your archives. If
    // you forge a key this way, purge Beta-Forge.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    context.player.tokenCard && context.player.tokenCard.name === 'Alpha-Gamma',
                trueGameAction: ability.actions.makeTokenCreature()
            })),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.tokenCard && context.player.tokenCard.name === 'Alpha-Gamma'
                    ? 'make an Alpha-Gamma'
                    : 'make no token'
            ],
            then: {
                alwaysTriggers: true,
                may: 'forge a key',
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier: 12 - context.player.archives.length
                })),
                then: {
                    gameAction: ability.actions.purge((context) => ({
                        target: context.source
                    })),
                    message: '{0} uses {1} to purge {1}'
                }
            }
        });
    }
}

BetaForge.id = 'beta-forge';

module.exports = BetaForge;
