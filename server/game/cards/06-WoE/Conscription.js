const Card = require('../../Card.js');

class Conscription extends Card {
    // Play: If there are more enemy creatures than friendly
    // creatures, make a number of token creatures equal to the
    // difference.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    !!context.player.opponent &&
                    context.player.opponent.creaturesInPlay.length >
                        context.player.creaturesInPlay.length,
                trueGameAction: ability.actions.makeTokenCreature((context) => ({
                    amount:
                        context.player.opponent.creaturesInPlay.length -
                        context.player.creaturesInPlay.length
                }))
            }),
            effect: 'make {1} token creature{2}',
            effectArgs: (context) => [
                context.player.opponent.creaturesInPlay.length >
                context.player.creaturesInPlay.length
                    ? context.player.opponent.creaturesInPlay.length -
                      context.player.creaturesInPlay.length
                    : 'no',
                context.player.opponent.creaturesInPlay.length !==
                context.player.creaturesInPlay.length
                    ? 's'
                    : ''
            ]
        });
    }
}

Conscription.id = 'conscription';

module.exports = Conscription;
