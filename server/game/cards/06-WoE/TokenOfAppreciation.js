const Card = require('../../Card.js');

class TokenOfAppreciation extends Card {
    // Play: Make a token creature.
    //
    // Forge a key at +7 Aember current cost, reduced by 1 Aember for
    // each friendly token creature.
    setupCardAbilities(ability) {
        this.play({
            message:
                '{0} uses {1} to make a token creature and forge a key for +7 current cost, minus 1 amber for each friendly token creature',
            messageArgs: (context) => [context.player, context.source],
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.forgeKey((context) => ({
                    modifier:
                        7 - context.player.creaturesInPlay.filter((card) => card.isToken()).length
                }))
            ])
        });
    }
}

TokenOfAppreciation.id = 'token-of-appreciation';

module.exports = TokenOfAppreciation;
