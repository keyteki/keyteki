const Card = require('../../Card.js');

class Teamwork extends Card {
    //Play:Make a token creature. If there are more enemy creatures than friendly creatures, archive Teamwork.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make a token creature{1}',
            effectArgs: (context) =>
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length
                    ? ' and archive this card'
                    : '',
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.opponent &&
                        context.player.opponent.creaturesInPlay.length >
                            context.player.creaturesInPlay.length,
                    trueGameAction: ability.actions.archive()
                })
            ])
        });
    }
}

Teamwork.id = 'teamwork';

module.exports = Teamwork;
