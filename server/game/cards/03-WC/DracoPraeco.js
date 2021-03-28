const Card = require('../../Card.js');

class DracoPraeco extends Card {
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                message: '{0} uses {1} to enrage {3}',
                messageArgs: (context) => [
                    context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
                ],
                target: {
                    mode: 'house'
                },
                gameAction: ability.actions.enrage((context) => ({
                    target: context.game.creaturesInPlay.filter((card) =>
                        card.hasHouse(context.house)
                    )
                }))
            }
        });
    }
}

DracoPraeco.id = 'draco-praeco';

module.exports = DracoPraeco;
