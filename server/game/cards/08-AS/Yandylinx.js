import Card from '../../Card.js';

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

export default Yandylinx;
