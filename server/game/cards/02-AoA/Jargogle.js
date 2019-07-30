const Card = require('../../Card.js');

class Jargogle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.placeUnder(context => ({
                    parent: context.source,
                    facedown: true
                }))
            }
        });

        this.destroyed({
            effect: '{1}{2}',
            effectArgs: context => [
                context.game.activePlayer === context.player ? 'play ' : 'archive ',
                context.game.activePlayer === context.player ? context.source.childCards[0] : 'a card'
            ],
            gameAction: [
                ability.actions.playCard(context => ({ target: context.game.activePlayer === context.player ? context.source.childCards : [] })),
                ability.actions.archive(context => ({ target: context.game.activePlayer !== context.player ? context.source.childCards : [] }))
            ]
        });
    }
}

Jargogle.id = 'jargogle';

module.exports = Jargogle;
