const Card = require('../../Card.js');

class NovuDynamo extends Card {
    // At the start of your turn, you may discard a Logos card from your hand or archives. If you do, gain 1A. Otherwise, destroy Novu Dynamo.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                activePromptTitle: {
                    text: 'Destroy {{card}} or Discard a Logos Card',
                    values: { card: 'Novu Dynamo' }
                },
                location: 'any',
                cardCondition: (card, context) =>
                    card === context.source ||
                    (card.hasHouse('logos') &&
                        (card.location === 'archives' || card.location === 'hand')),
                controller: 'self',
                gameAction: ability.actions.conditional({
                    condition: (context) => context.target === context.source,
                    trueGameAction: ability.actions.sacrifice(),
                    falseGameAction: ability.actions.sequential([
                        ability.actions.discard(),
                        ability.actions.conditional({
                            condition: (context) =>
                                context.target && context.target.location === 'discard',
                            trueGameAction: ability.actions.gainAmber((context) => ({
                                target: context.player
                            }))
                        })
                    ])
                })
            },
            effect: '{1} {2}{3}',
            effectArgs: (context) =>
                context.target === context.source
                    ? ['sacrifice', context.target, '']
                    : ['discard', context.target, ' and gain 1 amber']
        });
    }
}

NovuDynamo.id = 'novu-dynamo';

module.exports = NovuDynamo;
