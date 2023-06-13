const Card = require('../../Card.js');

class StandardizedTesting extends Card {
    // Play: Destroy each creature with the lowest power and each creature with the highest power.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => {
                if (context.game.creaturesInPlay.length === 0) {
                    return { target: [] };
                }

                let highestPower = context.game.creaturesInPlay.sort((a, b) => b.power - a.power)[0]
                    .power;
                let lowestPower = context.game.creaturesInPlay.sort((a, b) => a.power - b.power)[0]
                    .power;

                return {
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.power === highestPower || card.power === lowestPower
                    )
                };
            })
        });
    }
}

StandardizedTesting.id = 'standardized-testing';

module.exports = StandardizedTesting;
