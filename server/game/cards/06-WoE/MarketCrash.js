import Card from '../../Card.js';

class MarketCrash extends Card {
    // Play: Destroy each non-token creature. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each non-token creature',
            gameAction: [
                ability.actions.gainChains({ amount: 2 }),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !card.isToken())
                }))
            ]
        });
    }
}

MarketCrash.id = 'market-crash';

export default MarketCrash;
