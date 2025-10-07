import Card from '../../Card.js';

class InevitableDecay extends Card {
    // Play: Destroy each artifact and upgrade. For each card
    // destroyed this way, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.cardsInPlay
                    .filter((c) => c.type === 'artifact')
                    .concat(context.game.creaturesInPlay.flatMap((card) => card.upgrades || []))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                })),
                message: '{0} uses {1} to make {3} token creatures',
                messageArgs: (context) => [
                    Math.ceil(context.preThenEvents.filter((event) => !event.cancelled).length)
                ]
            }
        });
    }
}

InevitableDecay.id = 'inevitable-decay';

export default InevitableDecay;
