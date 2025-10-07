import Card from '../../Card.js';

class HallowedEveFestival extends Card {
    // Play: Discard the top 5 cards of your deck. For each Geistoid
    // card discarded this way, a friendly creature captures 1 A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 5)
            })),
            then: {
                message: '{0} uses {1} to capture {3} amber onto friendly creatures',
                messageArgs: (context) => [
                    context.preThenEvents.filter(
                        (event) => !!event.card && event.card.hasHouse('geistoid')
                    ).length
                ],
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvents.filter(
                        (event) => !!event.card && event.card.hasHouse('geistoid')
                    ).length,
                    action: ability.actions.capture({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to capture 1 amber',
                            cardType: 'creature',
                            controller: 'self'
                        }
                    })
                }))
            }
        });
    }
}

HallowedEveFestival.id = 'hallowed-eve-festival';

export default HallowedEveFestival;
