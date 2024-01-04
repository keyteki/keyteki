const Card = require('../../Card.js');

class BearFlute extends Card {
    // Action: Fully heal an Ancient Bear. If there are no Ancient Bears in play, search your deck and discard pile and put each Ancient Bear from them into your hand. If you do, shuffle your discard pile into your deck.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.name === 'Ancient Bear',
                gameAction: ability.actions.heal({ fully: true })
            },
            effect: '{1}{2}',
            effectArgs: (context) =>
                context.target
                    ? ['heal ', context.target]
                    : ['search their deck and discard for any Ancient Bears'],
            gameAction: ability.actions.returnToHand((context) => ({
                location: ['deck', 'discard'],
                target: !context.game.creaturesInPlay.some((card) => card.name === 'Ancient Bear')
                    ? context.player.deck
                          .filter((card) => card.name === 'Ancient Bear')
                          .concat(
                              context.player.discard.filter((card) => card.name === 'Ancient Bear')
                          )
                    : []
            })),
            then: {
                gameAction: ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: !context.game.creaturesInPlay.some(
                        (card) => card.name === 'Ancient Bear'
                    )
                        ? context.player.discard
                        : []
                }))
            }
        });
    }
}

BearFlute.id = 'bear-flute';

module.exports = BearFlute;
