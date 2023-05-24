const Card = require('../../Card.js');

class Outflank extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each Sanctum flank creature to capture 2 amber from their opponent',
            gameAction: [
                ability.actions.capture((context) => ({
                    amount: 2,
                    target: context.player.creaturesInPlay.filter(
                        (card) => card.hasHouse('sanctum') && card.isOnFlank()
                    )
                })),
                ability.actions.capture((context) => ({
                    amount: 2,
                    player: context.player,
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter(
                              (card) => card.hasHouse('sanctum') && card.isOnFlank()
                          )
                        : []
                }))
            ]
        });
    }
}

Outflank.id = 'outflank';

module.exports = Outflank;
