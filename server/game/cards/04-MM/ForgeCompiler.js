const Card = require('../../Card.js');

class ForgeCompiler extends Card {
    // After your opponent forges a key, destroy Forge Compiler and ward each friendly creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player !== context.player
            },
            effect: 'destroy {0} and ward each friendly creature',
            gameAction: [
                ability.actions.destroy(),
                ability.actions.ward((context) => ({
                    target: context.player.creaturesInPlay
                }))
            ]
        });
    }
}

ForgeCompiler.id = 'forge-compiler';

module.exports = ForgeCompiler;
