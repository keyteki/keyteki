import Card from '../../Card.js';

class Absolve extends Card {
    // Play: Heal 1D from each creature. Each creature healed this way captures 1A from its opponent
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.heal((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
            })),
            then: {
                gameAction: [
                    ability.actions.capture((context) => ({
                        target: context.preThenEvents
                            .filter(
                                (event) =>
                                    !event.cancelled &&
                                    event.amount > 0 &&
                                    event.clone.controller === context.player
                            )
                            .map((event) => event.card)
                    })),
                    ability.actions.capture((context) => ({
                        player: context.player,
                        target: context.preThenEvents
                            .filter(
                                (event) =>
                                    !event.cancelled &&
                                    event.amount > 0 &&
                                    event.clone.controller === context.player.opponent
                            )
                            .map((event) => event.card)
                    }))
                ]
            }
        });
    }
}

Absolve.id = 'absolve';

export default Absolve;
