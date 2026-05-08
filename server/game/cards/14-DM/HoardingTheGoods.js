const Card = require('../../Card.js');

class HoardingTheGoods extends Card {
    // Play: Each friendly exhausted creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay.filter((card) => card.exhausted)
            })),
            then: () => ({
                alwaysTriggers: true,
                handler: (thenContext) => {
                    const captured = thenContext.preThenEvents
                        .filter((event) => event.name === 'onCapture' && !event.cancelled)
                        .map((event) => event.card);
                    if (captured.length > 0) {
                        thenContext.game.addMessage(
                            '{0} plays {1} to have {2} capture 1 amber',
                            thenContext.player,
                            thenContext.source,
                            captured
                        );
                    } else {
                        thenContext.game.addMessage(
                            '{0} plays {1}',
                            thenContext.player,
                            thenContext.source
                        );
                    }
                }
            })
        });
    }
}

HoardingTheGoods.id = 'hoarding-the-goods';

module.exports = HoardingTheGoods;
