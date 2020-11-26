const Card = require('../../Card.js');

class NovuDynamo extends Card {
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
            }
        });
    }
}

NovuDynamo.id = 'novu-dynamo';

module.exports = NovuDynamo;
