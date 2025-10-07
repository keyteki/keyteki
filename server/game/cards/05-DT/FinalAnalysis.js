import Card from '../../Card.js';

class FinalAnalysis extends Card {
    // Play: Destroy each creature. Each player draws a card for each creature they controlled that was destroyed this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.draw((context) => ({
                        target: context.player,
                        amount: context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller === context.player
                        ).length
                    })),
                    ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller === context.player.opponent
                        ).length
                    }))
                ]
            }
        });
    }
}

FinalAnalysis.id = 'final-analysis';

export default FinalAnalysis;
