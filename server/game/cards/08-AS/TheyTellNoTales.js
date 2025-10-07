import Card from '../../Card.js';

class TheyTellNoTales extends Card {
    // Play: Choose a house. Destroy each creature of the chosen
    // house. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'destroy all creatures of house {1} and gain 2 chains',
            effectArgs: (context) => [context.house],
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) =>
                        card.hasHouse(context.house)
                    )
                })),
                ability.actions.gainChains({ amount: 2 })
            ]
        });
    }
}

TheyTellNoTales.id = 'they-tell-no-tales';

export default TheyTellNoTales;
