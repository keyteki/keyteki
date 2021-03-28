const Card = require('../../Card.js');

class BearFlute extends Card {
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
            gameAction: ability.actions.search((context) =>
                !context.game.creaturesInPlay.some((card) => card.name === 'Ancient Bear')
                    ? { cardName: 'Ancient Bear' }
                    : {}
            ),
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
