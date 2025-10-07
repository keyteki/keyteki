import Card from '../../Card.js';

class Recycler extends Card {
    // After Reap: Discard the top 3 cards of your deck. For each
    // creature discarded this way, make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 3)
            })),
            then: {
                message: '{0} uses {1} to make {3} token creature{4}',
                messageArgs: (context) => [
                    context.preThenEvents.filter(
                        (event) => !!event.card && event.card.type === 'creature'
                    ).length,
                    context.preThenEvents.filter(
                        (event) => !!event.card && event.card.type === 'creature'
                    ).length === 1
                        ? ''
                        : 's'
                ],
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.preThenEvents.filter(
                        (event) => !!event.card && event.card.type === 'creature'
                    ).length
                }))
            }
        });
    }
}

Recycler.id = 'recycler';

export default Recycler;
