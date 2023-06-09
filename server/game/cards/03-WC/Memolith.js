const Card = require('../../Card.js');

class Memolith extends Card {
    // Action: Graft an action card from your hand onto Memolith (place it faceup under this card), or trigger the play effect of an action card grafted onto Memolith.
    setupCardAbilities(ability) {
        this.action({
            target: {
                location: 'any',
                cardType: 'action',
                cardCondition: (card, context) =>
                    (card.location === 'hand' && card.controller == context.game.activePlayer) ||
                    (card.parent === context.source && card.location === 'grafted'),
                gameAction: ability.actions.conditional({
                    condition: (context) => context.target.location === 'hand',
                    trueGameAction: ability.actions.graft((context) => ({
                        parent: context.source
                    })),
                    falseGameAction: ability.actions.resolveAbility({
                        ability: (ability) => ability.isPlay()
                    })
                })
            }
        });
    }
}

Memolith.id = 'memolith';

module.exports = Memolith;
