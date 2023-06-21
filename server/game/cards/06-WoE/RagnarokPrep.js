const Card = require('../../Card.js');

class RagnarokPrep extends Card {
    // Play: Make a token creature. Then, if you control more creatures than your opponent, your opponent loses 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent &&
                    context.player.creaturesInPlay.length >
                        context.player.opponent.creaturesInPlay.length,
                gameAction: ability.actions.loseAmber({
                    amount: 2
                })
            }
        });
    }
}

RagnarokPrep.id = 'ragnarok-prep';

module.exports = RagnarokPrep;
