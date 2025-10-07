import Card from '../../Card.js';

class CityStateInterest extends Card {
    // Play: Each friendly creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay
            })),
            preferActionPromptMessage: true,
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to capture 1 amber onto {3}',
                messageArgs: (context) => [
                    context.preThenEvents
                        .filter((event) => !event.cancelled && event.card)
                        .map((event) => event.card)
                ]
            }
        });
    }
}

CityStateInterest.id = 'city-state-interest';

export default CityStateInterest;
