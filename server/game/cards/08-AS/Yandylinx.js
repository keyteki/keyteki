const Card = require('../../Card.js');

class Yandylinx extends Card {
    // After Reap: Discard a card. If you do, your opponent loses 1A.
    // Scrap: Each friendly Mars creature captures 1A.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                message: '{0} uses {1} to make {4} lose {3} amber',
                messageArgs: (context) => [
                    context.player.opponent.amber >= 1 ? 1 : 0,
                    context.player.opponent
                ],
                gameAction: ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.preThenEvent.clone.controller.opponent
                }))
            }
        });

        this.scrap({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay.filter((c) => c.hasHouse('mars'))
            }))
        });
    }
}

Yandylinx.id = 'yandylinx';

module.exports = Yandylinx;
