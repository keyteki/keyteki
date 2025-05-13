const Card = require('../../Card.js');

class ForgeAheadWithConfidence extends Card {
    // During your opponent's turn, after your opponent forges a key, fulfill Forge Ahead With Confidence.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onForgeKey: (_, context) => {
                    console.log(
                        'FORGE KEY',
                        context.game.activePlayer.name,
                        context.source.controller.opponent.name
                    );
                    return context.game.activePlayer === context.source.controller.opponent;
                }
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

ForgeAheadWithConfidence.id = 'forge-ahead-with-confidence';

module.exports = ForgeAheadWithConfidence;
